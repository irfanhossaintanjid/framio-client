import { ObjectId, type Document, type WithId } from "mongodb"

import { db } from "@/lib/auth"

type SavedStudioRecord = {
  _id?: ObjectId
  userEmail: string
  studioId: string
  savedAt: string
}

const studiosCollection = db.collection("studios")
const wishlistCollection = db.collection<SavedStudioRecord>("savedStudios")

let wishlistIndexPromise: Promise<string> | null = null

export function ensureWishlistIndex() {
  wishlistIndexPromise ??= wishlistCollection.createIndex(
    { userEmail: 1, studioId: 1 },
    { unique: true, name: "saved_studios_user_studio_unique" },
  )
  return wishlistIndexPromise
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidStudioId(studioId: string) {
  return ObjectId.isValid(studioId)
}

export async function getSavedStudioIds(userEmail: string) {
  await ensureWishlistIndex()
  const records = await wishlistCollection
    .find({ userEmail: normalizeEmail(userEmail) }, { projection: { studioId: 1 } })
    .toArray()

  return new Set(records.map((record) => record.studioId))
}

export function serializeStudio(
  studio: WithId<Document>,
  isSaved = false,
) {
  return {
    ...studio,
    _id: studio._id.toString(),
    isSaved,
  }
}

export async function getStudiosWithSavedState(
  studios: WithId<Document>[],
  userEmail?: string | null,
) {
  const savedIds = userEmail ? await getSavedStudioIds(userEmail) : new Set<string>()

  return studios.map((studio) =>
    serializeStudio(studio, savedIds.has(studio._id.toString())),
  )
}

export async function saveStudio(userEmail: string, studioId: string) {
  await ensureWishlistIndex()
  const normalizedEmail = normalizeEmail(userEmail)
  const result = await wishlistCollection.updateOne(
    { userEmail: normalizedEmail, studioId },
    {
      $setOnInsert: {
        userEmail: normalizedEmail,
        studioId,
        savedAt: new Date().toISOString(),
      },
    },
    { upsert: true },
  )

  return { created: result.upsertedCount > 0 }
}

export async function removeSavedStudio(userEmail: string, studioId: string) {
  await ensureWishlistIndex()
  return wishlistCollection.deleteOne({
    userEmail: normalizeEmail(userEmail),
    studioId,
  })
}

export async function getSavedStudios(userEmail: string) {
  await ensureWishlistIndex()
  const records = await wishlistCollection
    .find({ userEmail: normalizeEmail(userEmail) })
    .sort({ savedAt: -1 })
    .toArray()

  if (!records.length) return []

  const objectIds = records
    .filter((record) => isValidStudioId(record.studioId))
    .map((record) => new ObjectId(record.studioId))
  const studios = await studiosCollection
    .find({ _id: { $in: objectIds } })
    .toArray()
  const studiosById = new Map(
    studios.map((studio) => [studio._id.toString(), studio]),
  )

  return records.flatMap((record) => {
    const studio = studiosById.get(record.studioId)
    return studio
      ? [{ ...serializeStudio(studio, true), savedAt: record.savedAt }]
      : []
  })
}

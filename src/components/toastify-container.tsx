"use client"

import { ToastContainer } from "react-toastify"

export function ToastifyContainer() {
  return (
    <ToastContainer
      position="top-right"
      newestOnTop
      limit={4}
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  )
}

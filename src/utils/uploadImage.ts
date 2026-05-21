export const uploadImage = async (file: File) => {
  const data = new FormData()

  data.append("file", file)

  // 🔥 acá va tu upload preset de Cloudinary
  data.append("upload_preset", "ml_default")

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dulxofiti/image/upload",
    {
      method: "POST",
      body: data,
    }
  )

  const json = await res.json()

  return json.secure_url
}
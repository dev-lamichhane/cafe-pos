'use server'

export async function verifyAdminPasswordAction(formData: FormData) {
  const inputPassword = formData.get('password')
  const correctPassword = process.env.ADMIN_PASSWORD

  if (!correctPassword) {
    throw new Error('[AuthError] ADMIN_PASSWORD is not set in .env.local')
  }

  if (typeof inputPassword !== 'string') {
    return { success: false, message: 'Password is required' }
  }

  if (inputPassword !== correctPassword) {
    return { success: false, message: 'Invalid password' }
  }

  // No cookies here — the client will handle that later.
  return { success: true }
}

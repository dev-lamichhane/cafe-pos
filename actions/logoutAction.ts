'use server'

export async function logoutAction() {
  // Since we are using client cookie, we will just return
  // UI will clear cookie manually
  return true
}

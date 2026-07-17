import type { NormalizedSocialAccount } from '@/lib/social/connectors/types'
import {
  deleteSocialAccount,
  getSocialAccount,
  listSocialAccounts,
  upsertSocialAccount,
} from './persistence'

const memory = new Map<string, NormalizedSocialAccount>()

export async function getStoredAccount(accountId: string): Promise<NormalizedSocialAccount | undefined> {
  try {
    const db = await getSocialAccount(accountId)
    if (db) {
      memory.set(accountId, db)
      return db
    }
  } catch {
    /* fallback */
  }
  return memory.get(accountId)
}

export async function getAllStoredAccounts(): Promise<NormalizedSocialAccount[]> {
  try {
    const db = await listSocialAccounts()
    if (db.length > 0) {
      for (const a of db) memory.set(a.id, a)
      return db
    }
  } catch {
    /* fallback */
  }
  return Array.from(memory.values())
}

export async function upsertStoredAccount(account: NormalizedSocialAccount): Promise<void> {
  memory.set(account.id, account)
  try {
    await upsertSocialAccount(account)
  } catch (err) {
    console.error('social account db save failed:', err instanceof Error ? err.message : err)
  }
}

export async function deleteStoredAccount(accountId: string): Promise<void> {
  memory.delete(accountId)
  try {
    await deleteSocialAccount(accountId)
  } catch {
    /* best-effort */
  }
}

export interface Contact {
  name: string
  phone: string
}

export interface CreateGroup {
  name: string
  contacts: Contact[]
}

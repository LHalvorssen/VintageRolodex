import Foundation
import SwiftUI

class ContactStore: ObservableObject {
    @Published var contacts: [Contact] = []

    private let saveKey = "VintageRolodexContacts"

    init() {
        loadContacts()
        if contacts.isEmpty {
            contacts = Contact.sampleContacts
            saveContacts()
        }
    }

    func addContact(_ contact: Contact) {
        contacts.append(contact)
        contacts.sort { $0.lastName.lowercased() < $1.lastName.lowercased() }
        saveContacts()
    }

    func updateContact(_ contact: Contact) {
        if let index = contacts.firstIndex(where: { $0.id == contact.id }) {
            contacts[index] = contact
            contacts.sort { $0.lastName.lowercased() < $1.lastName.lowercased() }
            saveContacts()
        }
    }

    func deleteContact(_ contact: Contact) {
        contacts.removeAll { $0.id == contact.id }
        saveContacts()
    }

    func contactsForLetter(_ letter: String) -> [Contact] {
        contacts.filter { $0.lastName.uppercased().hasPrefix(letter) }
    }

    private func saveContacts() {
        if let data = try? JSONEncoder().encode(contacts) {
            UserDefaults.standard.set(data, forKey: saveKey)
        }
    }

    private func loadContacts() {
        if let data = UserDefaults.standard.data(forKey: saveKey),
           let decoded = try? JSONDecoder().decode([Contact].self, from: data) {
            contacts = decoded
        }
    }
}

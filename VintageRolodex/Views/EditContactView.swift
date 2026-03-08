import SwiftUI

struct EditContactView: View {
    @EnvironmentObject var contactStore: ContactStore
    @Environment(\.dismiss) var dismiss

    let contact: Contact

    @State private var firstName: String
    @State private var lastName: String
    @State private var company: String
    @State private var phoneNumber: String
    @State private var email: String
    @State private var address: String
    @State private var notes: String

    init(contact: Contact) {
        self.contact = contact
        _firstName = State(initialValue: contact.firstName)
        _lastName = State(initialValue: contact.lastName)
        _company = State(initialValue: contact.company)
        _phoneNumber = State(initialValue: contact.phoneNumber)
        _email = State(initialValue: contact.email)
        _address = State(initialValue: contact.address)
        _notes = State(initialValue: contact.notes)
    }

    var isValid: Bool {
        !firstName.trimmingCharacters(in: .whitespaces).isEmpty &&
        !lastName.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.93, green: 0.87, blue: 0.76)
                    .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 12) {
                        formField(title: "FIRST NAME", text: $firstName, icon: "person.fill")
                        formField(title: "LAST NAME", text: $lastName, icon: "person.fill")
                        formField(title: "COMPANY", text: $company, icon: "building.2.fill")
                        formField(title: "PHONE", text: $phoneNumber, icon: "phone.fill")
                            .keyboardType(.phonePad)
                        formField(title: "EMAIL", text: $email, icon: "envelope.fill")
                            .keyboardType(.emailAddress)
                            .textInputAutocapitalization(.never)
                        formField(title: "ADDRESS", text: $address, icon: "mappin")

                        VStack(alignment: .leading, spacing: 4) {
                            Label("NOTES", systemImage: "note.text")
                                .font(.system(size: 11, weight: .bold, design: .monospaced))
                                .foregroundColor(Color(red: 0.55, green: 0.45, blue: 0.30))
                                .tracking(2)

                            TextEditor(text: $notes)
                                .font(.system(.body, design: .serif))
                                .foregroundColor(Color(red: 0.2, green: 0.15, blue: 0.08))
                                .scrollContentBackground(.hidden)
                                .frame(minHeight: 80)
                                .padding(8)
                                .background(
                                    RoundedRectangle(cornerRadius: 6)
                                        .fill(Color(red: 0.96, green: 0.93, blue: 0.86))
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 6)
                                        .strokeBorder(Color(red: 0.75, green: 0.65, blue: 0.50), lineWidth: 1)
                                )
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Edit Card")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .font(.system(.body, design: .serif))
                        .foregroundColor(Color(red: 0.55, green: 0.40, blue: 0.25))
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        var updated = contact
                        updated.firstName = firstName.trimmingCharacters(in: .whitespaces)
                        updated.lastName = lastName.trimmingCharacters(in: .whitespaces)
                        updated.company = company
                        updated.phoneNumber = phoneNumber
                        updated.email = email
                        updated.address = address
                        updated.notes = notes
                        contactStore.updateContact(updated)
                        dismiss()
                    }
                    .font(.system(.body, weight: .bold, design: .serif))
                    .foregroundColor(
                        isValid
                        ? Color(red: 0.35, green: 0.28, blue: 0.18)
                        : Color(red: 0.65, green: 0.58, blue: 0.45)
                    )
                    .disabled(!isValid)
                }
            }
        }
    }

    private func formField(title: String, text: Binding<String>, icon: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Label(title, systemImage: icon)
                .font(.system(size: 11, weight: .bold, design: .monospaced))
                .foregroundColor(Color(red: 0.55, green: 0.45, blue: 0.30))
                .tracking(2)

            TextField("", text: text)
                .font(.system(.body, design: .serif))
                .foregroundColor(Color(red: 0.2, green: 0.15, blue: 0.08))
                .padding(10)
                .background(
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color(red: 0.96, green: 0.93, blue: 0.86))
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 6)
                        .strokeBorder(Color(red: 0.75, green: 0.65, blue: 0.50), lineWidth: 1)
                )
        }
    }
}

#Preview {
    EditContactView(contact: Contact.sampleContacts[0])
        .environmentObject(ContactStore())
}

import SwiftUI

struct AddContactView: View {
    @EnvironmentObject var contactStore: ContactStore
    @Environment(\.dismiss) var dismiss

    @State private var firstName = ""
    @State private var lastName = ""
    @State private var company = ""
    @State private var phoneNumber = ""
    @State private var email = ""
    @State private var address = ""
    @State private var notes = ""

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
                    VStack(spacing: 16) {
                        // Card preview at top
                        cardPreview

                        // Form fields
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

                            // Notes — multiline
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
            }
            .navigationTitle("New Card")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .font(.system(.body, design: .serif))
                        .foregroundColor(Color(red: 0.55, green: 0.40, blue: 0.25))
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        let contact = Contact(
                            firstName: firstName.trimmingCharacters(in: .whitespaces),
                            lastName: lastName.trimmingCharacters(in: .whitespaces),
                            company: company,
                            phoneNumber: phoneNumber,
                            email: email,
                            address: address,
                            notes: notes
                        )
                        contactStore.addContact(contact)
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

    private var cardPreview: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(red: 0.96, green: 0.93, blue: 0.86))
                .frame(height: 80)
                .shadow(color: .black.opacity(0.1), radius: 2, y: 2)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .strokeBorder(Color(red: 0.80, green: 0.72, blue: 0.58), lineWidth: 1)
                )

            VStack(spacing: 4) {
                Text(firstName.isEmpty && lastName.isEmpty ? "NEW CARD" : "\(firstName) \(lastName)".uppercased())
                    .font(.system(size: 16, weight: .bold, design: .monospaced))
                    .foregroundColor(Color(red: 0.2, green: 0.15, blue: 0.08))
                    .tracking(1.5)

                if !company.isEmpty {
                    Text(company)
                        .font(.system(size: 12, design: .serif))
                        .foregroundColor(Color(red: 0.45, green: 0.38, blue: 0.25))
                        .italic()
                }
            }
        }
        .padding(.horizontal)
        .padding(.top, 8)
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
    AddContactView()
        .environmentObject(ContactStore())
}

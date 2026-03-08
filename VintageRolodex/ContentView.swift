import SwiftUI

struct ContentView: View {
    @EnvironmentObject var contactStore: ContactStore
    @State private var selectedLetter: String = "A"
    @State private var showingAddContact = false
    @State private var searchText = ""

    private let letters = (65...90).map { String(UnicodeScalar($0)) }

    var filteredContacts: [Contact] {
        let letterContacts = contactStore.contacts.filter {
            $0.lastName.uppercased().hasPrefix(selectedLetter)
        }
        if searchText.isEmpty {
            return letterContacts
        }
        return letterContacts.filter {
            $0.fullName.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        ZStack {
            // Warm aged paper background
            LinearGradient(
                colors: [
                    Color(red: 0.93, green: 0.87, blue: 0.76),
                    Color(red: 0.85, green: 0.78, blue: 0.65)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                // Header — vintage brass nameplate style
                headerView

                // Alphabet tabs — the classic rolodex letter dividers
                AlphabetTabView(
                    letters: letters,
                    selectedLetter: $selectedLetter
                )
                .padding(.top, 8)

                // Search bar with vintage styling
                searchBar

                // The rolodex card stack
                RolodexWheelView(
                    contacts: filteredContacts,
                    selectedLetter: selectedLetter
                )
                .padding(.horizontal)

                Spacer()
            }
        }
        .sheet(isPresented: $showingAddContact) {
            AddContactView()
        }
    }

    private var headerView: some View {
        ZStack {
            // Brass plate background
            RoundedRectangle(cornerRadius: 8)
                .fill(
                    LinearGradient(
                        colors: [
                            Color(red: 0.72, green: 0.58, blue: 0.30),
                            Color(red: 0.85, green: 0.72, blue: 0.40),
                            Color(red: 0.72, green: 0.58, blue: 0.30)
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .frame(height: 50)
                .shadow(color: .black.opacity(0.3), radius: 3, y: 2)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .strokeBorder(Color(red: 0.60, green: 0.48, blue: 0.25), lineWidth: 1.5)
                )

            HStack {
                Text("ROLODEX")
                    .font(.system(size: 24, weight: .bold, design: .serif))
                    .foregroundColor(Color(red: 0.25, green: 0.18, blue: 0.08))
                    .tracking(6)

                Spacer()

                Button(action: { showingAddContact = true }) {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                        .foregroundColor(Color(red: 0.25, green: 0.18, blue: 0.08))
                }
            }
            .padding(.horizontal, 20)
        }
        .padding(.horizontal)
        .padding(.top, 8)
    }

    private var searchBar: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(Color(red: 0.55, green: 0.45, blue: 0.30))
            TextField("Search contacts...", text: $searchText)
                .font(.system(.body, design: .serif))
                .foregroundColor(Color(red: 0.3, green: 0.2, blue: 0.1))
        }
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 6)
                .fill(Color(red: 0.95, green: 0.91, blue: 0.83))
                .shadow(color: .black.opacity(0.1), radius: 1, y: 1)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 6)
                .strokeBorder(Color(red: 0.75, green: 0.65, blue: 0.50), lineWidth: 1)
        )
        .padding(.horizontal)
        .padding(.top, 8)
    }
}

#Preview {
    ContentView()
        .environmentObject(ContactStore())
}

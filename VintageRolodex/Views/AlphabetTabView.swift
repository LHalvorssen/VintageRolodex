import SwiftUI

struct AlphabetTabView: View {
    let letters: [String]
    @Binding var selectedLetter: String
    @EnvironmentObject var contactStore: ContactStore

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 2) {
                    ForEach(letters, id: \.self) { letter in
                        let hasContacts = !contactStore.contactsForLetter(letter).isEmpty

                        Button(action: {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                selectedLetter = letter
                            }
                        }) {
                            VStack(spacing: 1) {
                                Text(letter)
                                    .font(.system(size: 14, weight: selectedLetter == letter ? .bold : .medium, design: .serif))
                                    .foregroundColor(
                                        selectedLetter == letter
                                        ? Color(red: 0.95, green: 0.90, blue: 0.80)
                                        : hasContacts
                                            ? Color(red: 0.30, green: 0.22, blue: 0.12)
                                            : Color(red: 0.65, green: 0.58, blue: 0.45)
                                    )

                                // Small dot indicator if letter has contacts
                                Circle()
                                    .fill(hasContacts ? Color(red: 0.65, green: 0.30, blue: 0.25) : Color.clear)
                                    .frame(width: 3, height: 3)
                            }
                            .frame(width: 28, height: 36)
                            .background(
                                ZStack {
                                    if selectedLetter == letter {
                                        // Selected tab — dark wood look
                                        RoundedRectangle(cornerRadius: 4)
                                            .fill(
                                                LinearGradient(
                                                    colors: [
                                                        Color(red: 0.40, green: 0.28, blue: 0.15),
                                                        Color(red: 0.50, green: 0.35, blue: 0.20)
                                                    ],
                                                    startPoint: .top,
                                                    endPoint: .bottom
                                                )
                                            )
                                    } else {
                                        // Unselected tab — lighter tab
                                        RoundedRectangle(cornerRadius: 4)
                                            .fill(
                                                LinearGradient(
                                                    colors: [
                                                        Color(red: 0.90, green: 0.85, blue: 0.75),
                                                        Color(red: 0.82, green: 0.76, blue: 0.64)
                                                    ],
                                                    startPoint: .top,
                                                    endPoint: .bottom
                                                )
                                            )
                                    }
                                }
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 4)
                                    .strokeBorder(Color(red: 0.60, green: 0.50, blue: 0.35), lineWidth: 0.5)
                            )
                            .shadow(color: .black.opacity(0.1), radius: 1, y: 1)
                        }
                        .id(letter)
                    }
                }
                .padding(.horizontal)
            }
            .onChange(of: selectedLetter) { _, newValue in
                withAnimation {
                    proxy.scrollTo(newValue, anchor: .center)
                }
            }
        }
    }
}

#Preview {
    AlphabetTabView(
        letters: (65...90).map { String(UnicodeScalar($0)) },
        selectedLetter: .constant("A")
    )
    .environmentObject(ContactStore())
    .background(Color(red: 0.85, green: 0.78, blue: 0.65))
}

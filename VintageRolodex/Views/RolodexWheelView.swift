import SwiftUI

struct RolodexWheelView: View {
    let contacts: [Contact]
    let selectedLetter: String

    @EnvironmentObject var contactStore: ContactStore
    @State private var currentIndex: Int = 0
    @State private var isFlipped: Bool = false
    @State private var showEditSheet: Bool = false
    @State private var contactToEdit: Contact?
    @State private var showDeleteAlert: Bool = false
    @State private var contactToDelete: Contact?
    @State private var flipDirection: Double = 0
    @State private var dragOffset: CGFloat = 0

    var body: some View {
        VStack(spacing: 12) {
            if contacts.isEmpty {
                emptyStateView
            } else {
                // Card counter
                Text("\(currentIndex + 1) of \(contacts.count)")
                    .font(.system(size: 12, weight: .medium, design: .monospaced))
                    .foregroundColor(Color(red: 0.55, green: 0.45, blue: 0.30))
                    .tracking(1)

                // The card stack with flip and swipe
                ZStack {
                    // Cards behind (stack effect)
                    if contacts.count > 1 {
                        ForEach(0..<min(3, contacts.count - 1), id: \.self) { offset in
                            let stackIndex = (currentIndex + offset + 1) % contacts.count
                            RolodexCardView(
                                contact: contacts[stackIndex],
                                isFlipped: false
                            )
                            .scaleEffect(1.0 - Double(offset + 1) * 0.03)
                            .offset(y: CGFloat(offset + 1) * 4)
                            .opacity(1.0 - Double(offset + 1) * 0.2)
                        }
                    }

                    // Current card
                    RolodexCardView(
                        contact: contacts[currentIndex],
                        isFlipped: isFlipped,
                        onEdit: {
                            contactToEdit = contacts[currentIndex]
                            showEditSheet = true
                        },
                        onDelete: {
                            contactToDelete = contacts[currentIndex]
                            showDeleteAlert = true
                        }
                    )
                    .cardFlip(isFlipped: isFlipped)
                    .offset(x: dragOffset)
                    .gesture(
                        DragGesture()
                            .onChanged { value in
                                dragOffset = value.translation.width
                            }
                            .onEnded { value in
                                let threshold: CGFloat = 80
                                withAnimation(.spring(response: 0.4, dampingFraction: 0.7)) {
                                    if value.translation.width < -threshold {
                                        // Swipe left — next card
                                        advanceCard()
                                    } else if value.translation.width > threshold {
                                        // Swipe right — previous card
                                        retreatCard()
                                    }
                                    dragOffset = 0
                                }
                            }
                    )
                    .onTapGesture {
                        withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                            isFlipped.toggle()
                        }
                    }
                }

                // Navigation arrows
                HStack(spacing: 40) {
                    Button(action: {
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.7)) {
                            retreatCard()
                        }
                    }) {
                        Image(systemName: "chevron.left.circle.fill")
                            .font(.title)
                            .foregroundColor(Color(red: 0.55, green: 0.45, blue: 0.30))
                    }
                    .disabled(contacts.count <= 1)

                    // Flip button
                    Button(action: {
                        withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                            isFlipped.toggle()
                        }
                    }) {
                        VStack(spacing: 2) {
                            Image(systemName: "arrow.triangle.2.circlepath")
                                .font(.title3)
                            Text("FLIP")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .tracking(2)
                        }
                        .foregroundColor(Color(red: 0.55, green: 0.45, blue: 0.30))
                    }

                    Button(action: {
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.7)) {
                            advanceCard()
                        }
                    }) {
                        Image(systemName: "chevron.right.circle.fill")
                            .font(.title)
                            .foregroundColor(Color(red: 0.55, green: 0.45, blue: 0.30))
                    }
                    .disabled(contacts.count <= 1)
                }
                .padding(.top, 4)
            }
        }
        .onChange(of: selectedLetter) { _, _ in
            currentIndex = 0
            isFlipped = false
        }
        .onChange(of: contacts.count) { _, newCount in
            if currentIndex >= newCount {
                currentIndex = max(0, newCount - 1)
            }
        }
        .sheet(item: $contactToEdit) { contact in
            EditContactView(contact: contact)
        }
        .alert("Remove Card", isPresented: $showDeleteAlert) {
            Button("Remove", role: .destructive) {
                if let contact = contactToDelete {
                    withAnimation {
                        contactStore.deleteContact(contact)
                        isFlipped = false
                    }
                }
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            if let contact = contactToDelete {
                Text("Remove \(contact.fullName) from your Rolodex?")
            }
        }
    }

    private var emptyStateView: some View {
        VStack(spacing: 16) {
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color(red: 0.96, green: 0.93, blue: 0.86).opacity(0.6))
                    .frame(height: 200)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .strokeBorder(
                                Color(red: 0.80, green: 0.72, blue: 0.58),
                                style: StrokeStyle(lineWidth: 1, dash: [6, 4])
                            )
                    )

                VStack(spacing: 10) {
                    Text("NO CARDS")
                        .font(.system(size: 18, weight: .bold, design: .monospaced))
                        .foregroundColor(Color(red: 0.6, green: 0.5, blue: 0.35))
                        .tracking(4)

                    Text("for letter \"\(selectedLetter)\"")
                        .font(.system(size: 14, design: .serif))
                        .foregroundColor(Color(red: 0.6, green: 0.5, blue: 0.35))
                        .italic()
                }
            }
        }
        .padding(.top, 20)
    }

    private func advanceCard() {
        guard contacts.count > 1 else { return }
        isFlipped = false
        currentIndex = (currentIndex + 1) % contacts.count
    }

    private func retreatCard() {
        guard contacts.count > 1 else { return }
        isFlipped = false
        currentIndex = (currentIndex - 1 + contacts.count) % contacts.count
    }
}

#Preview {
    RolodexWheelView(
        contacts: Contact.sampleContacts,
        selectedLetter: "A"
    )
    .environmentObject(ContactStore())
    .padding()
    .background(Color(red: 0.85, green: 0.78, blue: 0.65))
}

import SwiftUI

struct RolodexCardView: View {
    let contact: Contact
    let isFlipped: Bool
    var onEdit: () -> Void = {}
    var onDelete: () -> Void = {}

    var body: some View {
        ZStack {
            if isFlipped {
                cardBack
            } else {
                cardFront
            }
        }
        .frame(maxWidth: .infinity)
        .frame(height: 200)
    }

    // MARK: - Front of card (main contact info)
    private var cardFront: some View {
        ZStack {
            cardBackground

            VStack(alignment: .leading, spacing: 6) {
                // Top rule line
                Rectangle()
                    .fill(Color(red: 0.75, green: 0.30, blue: 0.30).opacity(0.5))
                    .frame(height: 1)

                // Name — big, like a typed index card
                Text(contact.fullName.uppercased())
                    .font(.system(size: 20, weight: .bold, design: .monospaced))
                    .foregroundColor(Color(red: 0.15, green: 0.10, blue: 0.05))
                    .tracking(1.5)

                if !contact.company.isEmpty {
                    Text(contact.company)
                        .font(.system(size: 14, weight: .regular, design: .serif))
                        .foregroundColor(Color(red: 0.35, green: 0.28, blue: 0.18))
                        .italic()
                }

                Divider()
                    .background(Color(red: 0.65, green: 0.55, blue: 0.40))

                // Phone
                HStack(spacing: 8) {
                    Image(systemName: "phone.fill")
                        .font(.caption)
                        .foregroundColor(Color(red: 0.55, green: 0.40, blue: 0.25))
                    Text(contact.phoneNumber)
                        .font(.system(size: 14, design: .monospaced))
                        .foregroundColor(Color(red: 0.2, green: 0.15, blue: 0.08))
                }

                // Email
                if !contact.email.isEmpty {
                    HStack(spacing: 8) {
                        Image(systemName: "envelope.fill")
                            .font(.caption)
                            .foregroundColor(Color(red: 0.55, green: 0.40, blue: 0.25))
                        Text(contact.email)
                            .font(.system(size: 13, design: .monospaced))
                            .foregroundColor(Color(red: 0.2, green: 0.15, blue: 0.08))
                    }
                }

                // Address
                if !contact.address.isEmpty {
                    HStack(spacing: 8) {
                        Image(systemName: "mappin")
                            .font(.caption)
                            .foregroundColor(Color(red: 0.55, green: 0.40, blue: 0.25))
                        Text(contact.address)
                            .font(.system(size: 12, design: .serif))
                            .foregroundColor(Color(red: 0.35, green: 0.28, blue: 0.18))
                            .lineLimit(2)
                    }
                }

                Spacer()
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 14)

            // Punched holes on the bottom edge
            punchHoles
        }
    }

    // MARK: - Back of card (notes + actions)
    private var cardBack: some View {
        ZStack {
            cardBackground

            VStack(alignment: .leading, spacing: 10) {
                Text("NOTES")
                    .font(.system(size: 12, weight: .bold, design: .monospaced))
                    .foregroundColor(Color(red: 0.55, green: 0.40, blue: 0.25))
                    .tracking(3)

                // Ruled lines with note text
                ZStack(alignment: .topLeading) {
                    VStack(spacing: 20) {
                        ForEach(0..<5, id: \.self) { _ in
                            Rectangle()
                                .fill(Color(red: 0.70, green: 0.60, blue: 0.45).opacity(0.4))
                                .frame(height: 0.5)
                        }
                    }

                    if !contact.notes.isEmpty {
                        Text(contact.notes)
                            .font(.system(size: 14, design: .serif))
                            .foregroundColor(Color(red: 0.2, green: 0.15, blue: 0.08))
                            .lineLimit(5)
                    } else {
                        Text("No notes yet...")
                            .font(.system(size: 14, design: .serif))
                            .foregroundColor(Color(red: 0.6, green: 0.5, blue: 0.4))
                            .italic()
                    }
                }

                Spacer()

                // Action buttons
                HStack {
                    Spacer()

                    Button(action: onEdit) {
                        Label("Edit", systemImage: "pencil")
                            .font(.system(size: 13, weight: .medium, design: .serif))
                            .foregroundColor(Color(red: 0.35, green: 0.28, blue: 0.18))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 6)
                            .background(
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(Color(red: 0.88, green: 0.82, blue: 0.72))
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 4)
                                    .strokeBorder(Color(red: 0.65, green: 0.55, blue: 0.40), lineWidth: 0.5)
                            )
                    }

                    Button(action: onDelete) {
                        Label("Remove", systemImage: "trash")
                            .font(.system(size: 13, weight: .medium, design: .serif))
                            .foregroundColor(Color(red: 0.65, green: 0.25, blue: 0.20))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 6)
                            .background(
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(Color(red: 0.95, green: 0.88, blue: 0.85))
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 4)
                                    .strokeBorder(Color(red: 0.75, green: 0.45, blue: 0.40), lineWidth: 0.5)
                            )
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 14)

            punchHoles
        }
        .rotation3DEffect(.degrees(180), axis: (x: 0, y: 1, z: 0))
    }

    // MARK: - Shared card background
    private var cardBackground: some View {
        RoundedRectangle(cornerRadius: 8)
            .fill(
                LinearGradient(
                    colors: [
                        Color(red: 0.98, green: 0.95, blue: 0.88),
                        Color(red: 0.94, green: 0.90, blue: 0.82),
                        Color(red: 0.96, green: 0.93, blue: 0.86)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .shadow(color: .black.opacity(0.15), radius: 4, y: 3)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .strokeBorder(Color(red: 0.80, green: 0.72, blue: 0.58), lineWidth: 1)
            )
            // Subtle paper texture effect
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.white.opacity(0.03))
            )
    }

    // MARK: - Bottom punch holes (like a real rolodex card)
    private var punchHoles: some View {
        VStack {
            Spacer()
            HStack(spacing: 40) {
                ForEach(0..<3, id: \.self) { _ in
                    Circle()
                        .fill(Color(red: 0.85, green: 0.78, blue: 0.65))
                        .frame(width: 8, height: 8)
                        .overlay(
                            Circle()
                                .strokeBorder(Color(red: 0.70, green: 0.62, blue: 0.48), lineWidth: 0.5)
                        )
                }
            }
            .padding(.bottom, 6)
        }
    }
}

#Preview {
    VStack {
        RolodexCardView(
            contact: Contact.sampleContacts[0],
            isFlipped: false
        )
        RolodexCardView(
            contact: Contact.sampleContacts[0],
            isFlipped: true
        )
    }
    .padding()
    .background(Color(red: 0.85, green: 0.78, blue: 0.65))
}

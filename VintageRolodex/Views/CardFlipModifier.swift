import SwiftUI

struct CardFlipModifier: ViewModifier {
    var isFlipped: Bool

    func body(content: Content) -> some View {
        content
            .rotation3DEffect(
                .degrees(isFlipped ? 180 : 0),
                axis: (x: 0, y: 1, z: 0),
                perspective: 0.5
            )
    }
}

extension View {
    func cardFlip(isFlipped: Bool) -> some View {
        modifier(CardFlipModifier(isFlipped: isFlipped))
    }
}

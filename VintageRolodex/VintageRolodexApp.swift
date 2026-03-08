import SwiftUI

@main
struct VintageRolodexApp: App {
    @StateObject private var contactStore = ContactStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(contactStore)
        }
    }
}

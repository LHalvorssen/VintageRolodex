import Foundation

struct Contact: Identifiable, Codable, Equatable {
    var id = UUID()
    var firstName: String
    var lastName: String
    var company: String
    var phoneNumber: String
    var email: String
    var address: String
    var notes: String
    var dateAdded: Date

    var fullName: String {
        "\(firstName) \(lastName)"
    }

    var initials: String {
        let first = firstName.first.map(String.init) ?? ""
        let last = lastName.first.map(String.init) ?? ""
        return "\(first)\(last)"
    }

    init(
        firstName: String = "",
        lastName: String = "",
        company: String = "",
        phoneNumber: String = "",
        email: String = "",
        address: String = "",
        notes: String = "",
        dateAdded: Date = Date()
    ) {
        self.firstName = firstName
        self.lastName = lastName
        self.company = company
        self.phoneNumber = phoneNumber
        self.email = email
        self.address = address
        self.notes = notes
        self.dateAdded = dateAdded
    }

    static let sampleContacts: [Contact] = [
        Contact(firstName: "Alice", lastName: "Anderson", company: "Anderson & Co.", phoneNumber: "(555) 123-4567", email: "alice@anderson.com", address: "123 Main St, Springfield"),
        Contact(firstName: "Bob", lastName: "Baker", company: "Baker's Bakery", phoneNumber: "(555) 234-5678", email: "bob@bakersbakery.com", address: "456 Oak Ave, Shelbyville"),
        Contact(firstName: "Carol", lastName: "Clark", company: "Clark Industries", phoneNumber: "(555) 345-6789", email: "carol@clark.com", address: "789 Pine Rd, Capital City"),
        Contact(firstName: "David", lastName: "Davis", company: "Davis Legal", phoneNumber: "(555) 456-7890", email: "david@davislegal.com", address: "321 Elm St, Ogdenville"),
        Contact(firstName: "Eleanor", lastName: "Evans", company: "Evans Antiques", phoneNumber: "(555) 567-8901", email: "eleanor@evansantiques.com", address: "654 Birch Ln, North Haverbrook"),
        Contact(firstName: "Frank", lastName: "Fisher", company: "Fisher & Sons", phoneNumber: "(555) 678-9012", email: "frank@fisherandsons.com", address: "987 Cedar Dr, Brockway"),
        Contact(firstName: "Grace", lastName: "Green", company: "Green Thumb Garden", phoneNumber: "(555) 789-0123", email: "grace@greenthumb.com", address: "147 Maple Ct, Springfield"),
        Contact(firstName: "Henry", lastName: "Harris", company: "Harris Hardware", phoneNumber: "(555) 890-1234", email: "henry@harrishw.com", address: "258 Walnut Way, Shelbyville"),
        Contact(firstName: "Irene", lastName: "Irving", company: "Irving Insurance", phoneNumber: "(555) 901-2345", email: "irene@irvinginsurance.com", address: "369 Ash Pl, Capital City"),
        Contact(firstName: "James", lastName: "Johnson", company: "Johnson Plumbing", phoneNumber: "(555) 012-3456", email: "james@johnsonplumbing.com", address: "741 Spruce Blvd, Ogdenville"),
        Contact(firstName: "Karen", lastName: "King", company: "King Realty", phoneNumber: "(555) 111-2222", email: "karen@kingrealty.com", address: "852 Willow St, North Haverbrook"),
        Contact(firstName: "Larry", lastName: "Lewis", company: "Lewis Auto", phoneNumber: "(555) 222-3333", email: "larry@lewisauto.com", address: "963 Poplar Ave, Brockway"),
        Contact(firstName: "Margaret", lastName: "Moore", company: "Moore Accounting", phoneNumber: "(555) 333-4444", email: "margaret@mooreacct.com", address: "159 Chestnut Rd, Springfield"),
    ]
}

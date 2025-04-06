import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, SectionList } from 'react-native';

const Contacts = () => {
  const contactsData = [
    {
      title: 'Family',
      data: [
        { id: '1', name: 'Usama', number: '555-1234', group: 'Family' },
        { id: '2', name: 'Butt', number: '555-5678', group: 'Family' },
        { id: '3', name: 'Hamza', number: '555-9012', group: 'Family' },
      ],
    },
    {
      title: 'Friends',
      data: [
        { id: '4', name: 'Usman', number: '555-3456', group: 'Friends' },
        { id: '5', name: 'Atta', number: '555-7890', group: 'Friends' },
        { id: '6', name: 'Ali', number: '555-2345', group: 'Friends' },
        { id: '7', name: 'Jawad', number: '555-6789', group: 'Friends' },
      ],
    },
    {
      title: 'Work',
      data: [
        { id: '8', name: 'Shazaib', number: '555-4567', group: 'Work' },
        { id: '9', name: 'Bilal', number: '555-8901', group: 'Work' },
        { id: '10', name: 'Salah', number: '555-1235', group: 'Work' },
      ],
    },
  ];

  const [searchText, setSearchText] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

const filteredContacts = contactsData.map(section => ({...section,data: section.data.filter(contact =>
      contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
      contact.number.includes(searchText)
  )
}))
.filter(section => section.data.length > 0);

const openContactDetails = (contact) => {
setSelectedContact(contact);
setModalVisible(true);
};

const closeModal = () => {
setModalVisible(false);
setSelectedContact(null);
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contacts Manager</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or number"
        value={searchText}
        onChangeText={setSearchText}
      />
      
      <SectionList
        sections={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => openContactDetails(item)}
          >
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactNumber}>{item.number}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedContact && (
              <>
                <Text style={styles.modalTitle}>Contact Details</Text>
                <Text style={styles.modalText}>Name: {selectedContact.name}</Text>
                <Text style={styles.modalText}>Number: {selectedContact.number}</Text>
                <Text style={styles.modalText}>Group: {selectedContact.group}</Text>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'orange',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'lightgray',
  },
  sectionHeader: {
    backgroundColor: '#ddd',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactItem: {
    backgroundColor: 'lightblue',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Contacts;
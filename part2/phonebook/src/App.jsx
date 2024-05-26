import { useState, useEffect } from "react"
import { isEqual } from "lodash"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import personService from "./services/persons"
import Notification from "./components/Notification"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterText, setFilterText] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationClass, setNotificationClass] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(error => console.error('Error fetching persons', error));
  },[])

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value)
  }

  const resetInputFields = () => {
    setNewName('');
    setNewPhone('');
  };

  const addOrUpdatePerson = (event) => {
    event.preventDefault()

    const personExists = persons.some(x => isEqual(x.name,newName))
    const phoneExists = persons.some(x => isEqual(x.phone,newPhone))

    if(phoneExists) {
      alert(`${newPhone} is already assigned to another person in phonebook`)
      return
    }

    if(personExists) {
      const existingPerson = persons.find(x => isEqual(x.name,newName))
      if(window.confirm(`Do you want to update ${existingPerson.name}'s phone number?`)) {
        const updatedPerson = { ...existingPerson, phone: newPhone}
        personService
          .updatePerson(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNotificationClass('info')
            setNotification(`Updated ${existingPerson.name} Phone Number`)
            setTimeout(() => setNotification(null),5000)
            resetInputFields()
          })
          .catch(error => {
            setNotificationClass('error')
            setNotification(error.response.data.error)
            setTimeout(() => setNotification(null),5000)
            console.error('Error updating person',error)
          })
      }
      return
    }

    const newPerson = { name: newName, phone: newPhone };

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotificationClass('info')
        setNotification(`Added ${newPerson.name}`)
        setTimeout(() => setNotification(null),5000)
        resetInputFields()
      })
      .catch(error => {
        setNotificationClass('error')
        setNotification(error.response.data.error)
        setTimeout(() => setNotification(null),5000)
        console.error('Error adding person',error)
      })
  }

  const handleDeletion = (id) => {
    const persontoDelete = persons.find(person => person.id === id)

    if(!persontoDelete) {
      setNotificationClass('error')
      setNotification(`Any person with id ${id} doesn't exist.`)
      setTimeout(() => setNotification(null),5000)
    }

    const personName = persontoDelete ? persontoDelete.name : null;
    if(personName && window.confirm(`Do you really want to delete ${personName}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setNotificationClass('error')
          setPersons(persons.filter(person => person.id !== id))
          setNotification(`Deleted ${personName}`)
          setTimeout(() => setNotification(null),5000)
        })
        .catch(error => {
          console.error('Error deleting person ',error)
        })
    } else {
      setNotificationClass('error')
      setNotification(`Something went wrong.`)
      setTimeout(() => setNotification(null),5000)
    }
  }

  const personsToShow = filterText.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} messageClass={notificationClass} />
      
      <Filter handleFilterChange={handleInputChange(setFilterText)} />

      <h3>add a new</h3>

      <PersonForm 
        addOrUpdatePerson={addOrUpdatePerson}
        newName={newName}
        handleNameChange={handleInputChange(setNewName)}
        newPhone={newPhone}
        handlePhoneChange={handleInputChange(setNewPhone)}
      />

      <h3>Numbers</h3>

      <Persons 
        persons={personsToShow}
        handleDeletion={handleDeletion}
      />
    </div>
  )
}

export default App
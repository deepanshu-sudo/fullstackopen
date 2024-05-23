const Persons = ({ persons, handleDeletion }) => {
    return (
        <>
            {persons.map(person => (
                <p key={person.id}>
                    {person.name} {person.phone} <button onClick={() => handleDeletion(person.id)}>delete</button>
                </p>
            ))}
        </>
    );
};

export default Persons;
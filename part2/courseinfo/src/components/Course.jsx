const Header = ({ course }) => {
    return (
        <h1>{course}</h1>
    )
}

const Part = ({ name, exercises }) => {
    return (
        <p>{name} {exercises}</p>
    )
}

const Content = ({ parts }) => {
    return (
        parts.map(({ id, name, exercises }) => <Part key={id} name={name} exercises={exercises} />)
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <p><b>total of {total} exercises</b></p>
    )
}

const Course = ({course}) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course
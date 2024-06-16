import { useSelector } from "react-redux"
import { Alert, AlertTitle, AlertDescription } from "./ui/alert"
import { ThumbsUp } from "lucide-react"
import { ThumbsDown } from "lucide-react"

const Notification = () => {
  const { message, className } = useSelector(state => state.notification)

  if (message !== null) {
    return (
      <Alert className='m-2'>
        {className === 'error' ? <ThumbsDown className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
        <AlertTitle>Alert</AlertTitle>
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
    )
  } else {
    return null
  }
}

export default Notification
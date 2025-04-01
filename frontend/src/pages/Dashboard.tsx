import {Text} from "../components/Text.tsx";
import {Button} from "../components/Button.tsx";
import {Inputs} from "../components/Inputs.tsx";


export const Dashboard = () => {
    return(
        <>
            <Text type='h1'> Header </Text>
            <Text type='h2'> Header </Text>
            <Text type='h3'> SubHeader </Text>
            <Text type='h4'> SubHeader </Text>
            <Text> Text </Text>
            <Text type='small'> small </Text>

            <div className={'flex flex-col gap-2 w-64'}>
            <Button size='large' variant='important'>Click Me</Button>
            <Button size='large'>Click Me</Button>

            <Button size='medium' variant='important'>Click Me</Button>
            <Button size='medium' >Click Me</Button>

            <Button size='small' variant='important'>Click Me</Button>
            <Button size='small'>Click Me</Button>

            <Inputs size='large' placeholder={'search...'}/>
            <Inputs size={'medium'} placeholder={'search...'}/>

            </div>
       </>
    )
}
import Image from "next/image";

export default function Page() {
    return <>
        <div className="row-start-1 row-end-12 flex flex-col w-full h-full items-center justify-center">
            <Image src={"/chat-start.svg"} alt={'starter icon'} width={382} height={397}/>
            <h2>
                Нажмите на имя пользователя, чтобы начать
            </h2>
        </div>

    </>
}
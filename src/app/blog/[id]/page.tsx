export default function blogpage({params} : {
    params : {
        id : string
    }
}){
    const id = params.id
    return(
    <div>
        Hello...{id}
    </div>)
}
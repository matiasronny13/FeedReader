import { Box, Divider, Icon, Link, Typography } from "@mui/material";
import { FeedItem } from "../../shared/types/FeedItem";
import './feedblog.scss'

type TProps = {
    listData: FeedItem[]
}

const FeedBlog = ({listData}:TProps) => {
    const backToTop = () => {
        document.getElementById("item-0")?.scrollIntoView({ behavior: "smooth" })
    }

    return (
    <>
        <Box className="feedBlog" display={"flex"} flexDirection={"column"} rowGap={3} alignItems={"center"} sx={{height: "840px", overflow: "hidden", overflowY: "auto"}}>
            {
                listData &&
                listData.map((d, idx) => (

                    <Box width={800} className="cardItem" key={d.id} id={`item-${idx.toString()}`}>
                        <Box className="cardHeader" 
                            boxShadow={2} 
                            display={"flex"} 
                            flexDirection={"column"} 
                            paddingX={2} paddingY={"10px"} 
                            sx={{borderTopLeftRadius:"10px", borderTopRightRadius:"10px", backgroundImage: "linear-gradient(to right, black, rgba(62,68,92,1))"}}>
                            <Typography sx={{fontSize:"11px", color: "text.secondary"}}>{new Date(d.pub_date).toLocaleString('fr-FR')}</Typography>
                            <Link target="_blank" 
                                rel="noreferrer" 
                                variant="h6"
                                sx={{textDecoration: "none", '&:hover': {textDecoration: 'underline'}, color: `${d.has_read ? 'auto' : '#FFA726'}`}} 
                                href={d.link} color="inherit">{d.title}
                            </Link>
                        </Box>
                        <Divider sx={{padding: "1px"}}/>
                        <Box className="cardContent" 
                            boxShadow={2} 
                            paddingX={2} paddingY={"10px"} 
                            sx={{ borderBottomLeftRadius:"10px", 
                                borderBottomRightRadius:"10px" , 
                                backgroundColor:"background.paper", 
                                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))"}} 
                            dangerouslySetInnerHTML={{__html: d.description?.
                                                            replaceAll("<ul>","<ul style='list-style-position: inside'>").
                                                            replaceAll('src', "src='" + import.meta.env.BASE_URL + "/images/download-image.png' onClick='this.src = this.attributes[\"ori\"].value;' style='cursor:pointer;object-fit:contain' ori")}} />
                    </Box>              
                ))
            }
            <Icon onClick={backToTop} sx={{position:"fixed", bottom:"50px", right:"50px", cursor:"pointer", '&:active': {color: "secondary.main"}}} fontSize="large">navigation</Icon>
        </Box>
    </>    
    )
}

export default FeedBlog;
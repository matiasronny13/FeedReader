import { Box, Fab, Icon, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

type TProps = {
    onMenuClicked: (action: MENU_ITEMS) => void
}

export enum MENU_ITEMS {
    REDOWNLOAD = "redownload",
    BLOG_MODE = "blog_mode",
    GRID_MODE = "grid_mode"
}

const FeedMenu = ({onMenuClicked}:TProps) => {
        
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (action: MENU_ITEMS) => {
        setAnchorEl(null);
        onMenuClicked(action)
    };

    return <Box sx={{position: 'absolute', top: 3, right: 30}}>
        <Fab variant="extended" onClick={handleClick} sx={{'&:hover': {bgcolor: 'secondary.main'}}}>
            <Icon>menu</Icon>
        </Fab>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <MenuItem sx={{width:"150px"}} onClick={() => handleClose(MENU_ITEMS.REDOWNLOAD)}>Re-download</MenuItem>
            <MenuItem sx={{width:"150px"}} onClick={() => handleClose(MENU_ITEMS.BLOG_MODE)}>Blog Mode</MenuItem>
            <MenuItem sx={{width:"150px"}} onClick={() => handleClose(MENU_ITEMS.GRID_MODE)}>Grid Mode</MenuItem>
        </Menu>
    </Box>
}

export default FeedMenu;
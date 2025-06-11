// Mui
import { Box } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
// Lib
import { hoverScale } from "../lib/hoverScale";

interface title{
    title?: string
}

export const AddNewButton = ({title='Add New'}: title) => {
    return(
        <>
          <Box className={`w-full mx-auto bg-gray-900/80 rounded-xl flex px-8 py-3 justify-center place-items-center gap-2 shadow-sm shadow-slate-700/50 ${hoverScale}`}>
            <AddIcon/>
            <h1 className='text-xl font-bold whitespace-nowrap'>{title}</h1>
          </Box>
        </>
    )
}
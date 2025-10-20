import { SuscribeInput } from '../SuscribeInput/SuscribeInput.jsx'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export const Footer = () => {
  return (
    <Footer className='
                      flex justify-center items-start
                      h-30 w-[100vw]'>
      <div className="">
        <span>¡Suscribite para recibir ofertas y cupones de descuento gratis!</span>
        <SuscribeInput></SuscribeInput>
      </div>
      <div>
        <span>Contacto</span>
        <span>
          <i class="fa-regular fa-envelope"></i>
          <a href="">contacto@nonini@gmail.com</a>
        </span>
      </div>
      <div>
        <span>
          Preguntas frecuentes
        </span>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
          <Typography component="span">Accordion 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </Footer>
  )
}
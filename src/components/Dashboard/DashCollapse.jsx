import React, { useState, useEffect } from 'react';
import { Button, Collapse} from 'react-bootstrap';



function DashCollapse(props) {
    const [open, setOpen] = useState(false);
    console.log(props)
    return (
      <>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          {props.props.firstValue + " " + props.props.secondValue}
        </Button>
        <Collapse in={open}>
            
          <div id="example-collapse-text">
          </div>
        </Collapse>
      </>
    );
  }
  
  export default DashCollapse;
import React, {}  from "react";
import {Modal} from "react-bootstrap";


const CustomModal = (props)=>{

  const renderSaveButton = ()=>{

    const html = (isDisabled)=>{
      return (
        <button onClick={props.addPhoto} type="button" className="btn btn-primary" disabled={isDisabled}
    data-bs-dismiss="modal">{props.saveText}</button>
      )
    } 

    if(!props.isSaveDisabled) return (
      html(false)
    )

    return (
      <div className="tooltipwrapper position-relative">
            <span className="tooltiptext">{props.tooptipText}</span>
          
            {html(true)}
      </div>
         
    )

  }


    return(
        <Modal size={props.size} show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflow: 'scroll'}}>
            {props.children}
        </Modal.Body>
        <Modal.Footer>
             <button onClick={props.resetModal} type="button" className="btn btn-secondary"
                        data-bs-dismiss="modal">{props.resetText}</button>
            
            {renderSaveButton()}
           
        </Modal.Footer>
      </Modal>
    )
}

export default CustomModal








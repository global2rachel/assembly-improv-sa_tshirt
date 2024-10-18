import React, {}  from "react";
import {Modal} from "react-bootstrap";


const CustomModal = (props)=>{

  const renderFooter = ()=>{

    if(!!props.noFooter) return;
    return (
      <Modal.Footer>
<button onClick={props.resetModal} type="button" className="btn btn-secondary"
                        data-bs-dismiss="modal">{props.resetText}</button>
        <button onClick={props.addPhoto} type="button" className="btn btn-primary"
    data-bs-dismiss="modal">{props.saveText}</button>
        </Modal.Footer>
      )
  }


    return(
        <Modal size={props.size} show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflow: 'scroll', height: props.height}}>
            {props.children}
        </Modal.Body>
        {renderFooter()}
      </Modal>
    )
}

export default CustomModal








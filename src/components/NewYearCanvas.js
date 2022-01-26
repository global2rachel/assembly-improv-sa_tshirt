import React, {useEffect, useState } from "react";
import { fabric } from "fabric";
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewYearCanvas.css';
import CustomModal from "./CustomModal";
import {Form} from "react-bootstrap";
import { useWindowSize } from "./WindowResize";

const NewYearCanvas = (props)=>{
    // const [windowSize, setWindowSize] = useState({})
    const [canvas, setCanvas] = useState('')
    const [canvasModal, setCanvasModal] = useState('')
    const [uploadImage, setUploadImage] = useState('')
    const [uploadClipPath, setUploadClipPath] = useState('')
    const [isCropped, setIsCropped] = useState(false)
    const [color, setColor] = useState('#000000')
    const [show,setShow] = useState(false)
    const [modalType,setModalType] = useState('')
    const [modalTitle,setModalTitle] = useState('')
    const handleShow = (type)=> {
        setModalType(type)
        type ==='bg' ? setModalTitle('Add Background'):setModalTitle('Add Photo')
        setShow(true)
    }
    const handleClose = ()=> {
        setShow(false)
        resetCanvasModal()
    }
    const windowSize = useWindowSize();

    useEffect(()=>{
        let canvasWidth = windowSize.isMobile ? document.querySelector('.mat_space').getBoundingClientRect().width : 500;

        const canvas = new fabric.Canvas('canvas', {
            width: canvasWidth,
            height: canvasWidth
        })


        setCanvas(canvas)

        fabric.Image.fromURL(props.bgImages[0].src, function (img) {
            img.scaleToWidth(canvas.width);
            img.scaleToHeight(canvas.height);
            canvas.setBackgroundImage(img);
            canvas.requestRenderAll();
        });


        
        

        initDeleteIcon()
        
        
    }, [windowSize])

    useEffect(()=>{

        if(!document.querySelector('.modal-body')) return 

        let canvasWidth = windowSize.isMobile ? document.querySelector('.modal_body').getBoundingClientRect().width*0.8 : 400;

        const canvasModal = new fabric.Canvas('canvasModal', {
            width: canvasWidth,
            height: canvasWidth,
        })
        setCanvasModal(canvasModal)

    },[show, windowSize])

    const initDeleteIcon = ()=>{
         const deleteImg = document.createElement('img');
         deleteImg.src = '/images/close-circle-outline.svg';
         deleteImg.classList.add('deleteBtn')
       
 
         const control = {
             x: 0.5,
             y: -0.5,
             offsetY: -16,
             offsetX: 16,
             cursorStyle: 'pointer',
             mouseUpHandler: (eventData, transform)=>deleteObject(eventData, transform),
             render: renderIcon(deleteImg),
             cornerSize: 24
         }
 
         fabric.Object.prototype.controls.deleteControl = new fabric.Control(control); 
         fabric.Textbox.prototype.controls.deleteControl = new fabric.Control(control);

         function renderIcon(icon) {
             return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
                 var size = this.cornerSize;
                 ctx.save();
                 ctx.translate(left, top);
                 ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
                 ctx.drawImage(icon, -size / 2, -size / 2, size, size);
                 ctx.restore();
             }
         }

         function deleteObject(eventData, transform) {    
            var target = transform.target;
            var canvas = target.canvas;
            canvas.remove(target);
            canvas.requestRenderAll();
        }
 
    }


    // }

   

    
    const reset = ()=>{      
        canvas.clear()
        fabric.Image.fromURL(props.bgImages[0].src, function (img) {
            img.scaleToWidth(canvas.width);
            img.scaleToHeight(canvas.height);
            canvas.setBackgroundImage(img);
            canvas.requestRenderAll();
        });
    } 

    const setBg = (src)=>{
        if(!canvas) return 
        fabric.Image.fromURL(src, function (img) {
            img.scaleToHeight(canvas.height);
            img.scaleToWidth(canvas.width);

            canvas.setBackgroundImage(img);
            canvas.requestRenderAll();
        });
    }
        


    const renderBgImages = ()=>{
        return props.bgImages.map(image=>{
            return (
                <img onClick={()=>setBg(image.src)} role="button" key={image.alt} src={image.src} className="img-thumbnail w-25" alt={image.alt} />
            )
        })

    }
    const output = ()=>{
        var image = canvas.toDataURL("image/png").replace("image/png",
                "image/octet-stream"
            ); 
            const a = document.createElement('a')
            a.href = image
            a.download = `newyear2020.jpeg`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
    }

    const uploadPhoto = (e)=>{
            const uploadImageTmp = new Image();
            uploadImageTmp.src = URL.createObjectURL(e.target.files[0]);
            uploadImageTmp.onload = function () {
                const image = new fabric.Image(uploadImageTmp);                    
                image.set({
                    left: 0,
                    top: 0,
                    clipPath: '',
                    hasControls: false,
                    
                    lockMovementX: true,
                    lockMovementY: true,
                });
                if(image.height > image.width){
                    image.scaleToHeight(canvasModal.height);
                }else{
                    image.scaleToWidth(canvasModal.width);
                }

                setUploadImage(image)
                
                canvasModal.add(image).setActiveObject(image).renderAll();
            } 
    }

    const addClip = ()=>{
        let userClipPath
        if(modalType === 'photo'){
            userClipPath = new fabric.Circle({
                top: uploadImage.getBoundingRect().top,
                left: uploadImage.getBoundingRect().left,
                radius: 50,
                width: 100,
                height: 100,
                fill: 'rgb(178, 178, 178, 0.4)',
            })

            userClipPath.setControlsVisibility({
                mb: false,
                ml: false,
                mr: false,
                mt: false
            })
        }

        if(modalType === 'bg'){
            userClipPath = new fabric.Rect({
                top: uploadImage.getBoundingRect().top,
                left: uploadImage.getBoundingRect().left,
                width: 200,
                height: 200,
                fill: 'rgb(178, 178, 178, 0.4)',
            })
        }

        canvasModal.add(userClipPath).setActiveObject(userClipPath).renderAll();
        setUploadClipPath(userClipPath)
    }

    const clipImage = ()=>{
        const imageCenter = {
            top: uploadImage.getBoundingRect().top + uploadImage.height * uploadImage.scaleY / 2,
            left: uploadImage.getBoundingRect().left + uploadImage.width * uploadImage.scaleX / 2,
        }

        if(modalType === 'photo'){
            uploadImage.set({
                clipPath: new fabric.Circle({
                    radius: uploadClipPath.radius / uploadImage.scaleX,
                    top: (uploadClipPath.getBoundingRect().top - imageCenter
                        .top) / uploadImage.scaleY,
                    left: (uploadClipPath.getBoundingRect().left -
                        imageCenter
                        .left) / uploadImage.scaleX,
                }),
            });
        }

        if(modalType === 'bg'){
            uploadImage.set({
                clipPath: new fabric.Rect({
                    width: uploadClipPath.width / uploadImage.scaleX,
                    height:uploadClipPath.height / uploadImage.scaleY,
                    top: (uploadClipPath.getBoundingRect().top - imageCenter
                        .top) / uploadImage.scaleY,
                    left: (uploadClipPath.getBoundingRect().left -
                        imageCenter
                        .left) / uploadImage.scaleX,
                }),
            });
        }

        

        
        setIsCropped(true)
        canvasModal.remove(uploadClipPath)
        canvasModal.renderAll()
    }

    const addPhoto = ()=>{
        if (uploadClipPath && isCropped) {
            uploadImage.set({
                top: -uploadClipPath.getBoundingRect().top,
                left: -uploadClipPath.getBoundingRect().left
            })
            canvasModal.renderAll()

            canvasModal.setDimensions({
                width: uploadClipPath.getBoundingRect().width,
                height: uploadClipPath.getBoundingRect().height
            });

        }



        if(uploadImage){
            const modifiedImage = canvasModal.toDataURL("image/png").replace("image/png",
                "image/octet-stream");
            const pasteImage = new Image();
            if(modalType==='bg') setBg(modifiedImage)
            if(modalType==='photo'){
                pasteImage.src = modifiedImage;
                pasteImage.onload = function () {
                    const image = new fabric.Image(pasteImage);
                    image.set({
                        left: 100,
                        top: 60,
                        objectCaching: false,
                    });
                    canvas.add(image).setActiveObject(image).renderAll();
                    
                }
            }
        }
           
            resetCanvasModal()
            setShow(false)
        
    }

    const resetCanvasModal= ()=>{
        const upload = document.querySelector('#imageUpload')
        upload.value = ''
        setUploadImage('')
        setUploadClipPath('')

        setIsCropped(false)
        canvasModal.clear()
        canvasModal.setDimensions({
            width: 500,
            height: 500
        });

    }

    const addText = ()=>{
        const text = document.querySelector('#text_input').value
        
            const textbox = new fabric.Textbox(text, {
                left: 50,
                top: 50,
                width: 100,
                fontSize: 20, 
                fontWeight: 800, // 
                // fill: colorInput, // 
                fill: color, //
                // fontStyle: 'italic', 
                fontFamily: 'Noto Sans TC', 
                // stroke: 'green', 
                // strokeWidth: 3,
                hasControls: true,
                borderColor: "orange",
                editingBorderColor: "blue", 
            });
            canvas.add(textbox).setActiveObject(textbox)
    }

    const renderClipIcon = ()=>{
        if(!uploadImage) return
        else if(uploadImage && uploadClipPath) return(
           <>
            <button onClick={addClip} type="button" className="btn btn-light">Add Clip</button>
            <button onClick={clipImage} type="button" className="btn btn-light">Crop</button>
           </>

        )
        else return(
            <button onClick={addClip} type="button" className="btn btn-light">Add Clip</button>
        )
    }

    const rightSecClass=()=>{
        let width =
               window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth
        return (
            `col-md-4 col-12 flex-column ${width > 767 ? 'my-auto' : 'mt-4'} px-2`
        )
    }

    const thumbnailClass = ()=>{
        let width =
               window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth
        return (
            `d-flex  ${width > 767 ? '' : 'justify-content-center'}`
        )
    }



        return(
            <div>
                <main className="custom container-fluid position-relative">
                    <div className="custom_page d-flex justify-content-center flex-wrap">
                    <div className="d-flex flex-wrap">
                        <div className="col-md-8 col-12 mat_space d-flex align-items-center justify-content-center">    
                            <canvas id="canvas"></canvas>                             
                        </div>
                        <div className={rightSecClass()} style={{height:'500px'}}>
                            <div className={thumbnailClass}>
                                {renderBgImages()}
                            </div>
                            <div className="d-flex flex-column align-items-start mt-4 h-50">
                                
                                <div className="mt-2 mb-auto">
                                    <button onClick={()=>handleShow('photo')} type="button" className="btn_f" data-bs-toggle="modal"
                                        data-bs-target="#exampleModal">
                                        Add Photo
                                    </button>
                                    <button onClick={()=>handleShow('bg')} type="button" className="btn_f ms-2" data-bs-toggle="modal"
                                        data-bs-target="#exampleModal">
                                        Add Background
                                    </button>
                                    
                                    <div className="d-flex justify-content-start mt-3">
                                        <input type="color" value={color} onChange={(e)=>setColor(e.target.value)}
                                            style={{height:'35px',width: '35px'}} className="mx-2"/>
                                         <input type="text" className="col w-75 me-2" id="text_input" />
                                        <button onClick={addText} type="button" className="btn_f" id="add_text_btn">新增文字</button>
                                      
                                    </div>
                                    
                                </div>
                                <div className="d-flex flex-wrap">
                                    <button onClick={reset} type="button" className="btn_g mt-2">重設</button>
                                    <button onClick={output} className="btn_l ms-2 mt-2" type="button">下載圖片</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    </div>
                    <div className="position-absolute d-flex align-items-end logo_wrap">
                        <h2>2022 虎年好</h2>
                    </div>
                     <div className="text-center">
                        <a type="button" className="text-center mt-2 text-white" href="https://github.com/rachel-liaw" target="_blank" rel="noreferrer">Copyright
                        © 2022 by Rachel
                        Liaw</a>
                    </div>
                </main>
                <CustomModal 
                    show={show} 
                    handleClose={handleClose} 
                    resetModal={resetCanvasModal} 
                    addPhoto={addPhoto} 
                    title={modalTitle} 
                    isSaveDisabled={uploadClipPath && !isCropped}
                    size="lg">
                    <Form.Group  onChange={uploadPhoto} className={`mb-3 ${uploadImage ? 'd-none' : ''}`}>
                        <Form.Control type="file" id="imageUpload"/>
                    </Form.Group>
                   <div>{renderClipIcon()}</div>
                   <canvas id="canvasModal" className="mx-auto"></canvas>
                </CustomModal>
                
            </div>
            
        )
    
}



export default NewYearCanvas
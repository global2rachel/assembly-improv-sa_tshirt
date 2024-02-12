import React, {useEffect, useState } from "react";
import { fabric } from "fabric";
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewYearCanvas.css';
import CustomModal from "./CustomModal";
import {Form} from "react-bootstrap";
import { useWindowSize } from "./WindowResize";
import textByLan from "../text-translation.json";
import Footer from "./Footer";

const NewYearCanvas = (props)=>{
    const [language, setLanguage] = useState({});
    const [canvas, setCanvas] = useState('');
    const [canvasModal, setCanvasModal] = useState('');
    const [uploadImage, setUploadImage] = useState('');
    const [uploadClipPath, setUploadClipPath] = useState('');
    const [isCropped, setIsCropped] = useState(false);
    const [color, setColor] = useState('#000000');
    const [font, setFont] = useState('Noto Sans TC');
    const [show,setShow] = useState(false);
    const [modalType,setModalType] = useState('');
    const [modalTitle,setModalTitle] = useState('');
    const canvasDefaultWidth = 500;
    const showModal = (type)=> {
        setModalType(type);
        type ==='bg' ? setModalTitle(renderText('btn_add_bg')):setModalTitle(renderText('btn_add_photo'));
        setShow(true);
    }
    const handleClose = ()=> {
        setShow(false)
        resetCanvasModal()
    }
    const windowSize = useWindowSize();

    useEffect(()=>{
        let canvasWidth = windowSize.isMobile ? document.querySelector('.mat_space').getBoundingClientRect().width : canvasDefaultWidth;

        const canvas = new fabric.Canvas('canvas', {
            width: canvasWidth,
            height: canvasWidth
        })

        setCanvas(canvas);

        fabric.Image.fromURL(props.bgImages[0].src, function (img) {
            img.scaleToWidth(canvas.width);
            img.scaleToHeight(canvas.height);
            canvas.setBackgroundImage(img);
            canvas.requestRenderAll();
        });

        let language = navigator.language.toLowerCase() ;
        setLanguage(`${language === 'zh-tw'? 'zh-tw':'en'}`);
        initDeleteIcon();

    }, [])

    useEffect(()=>{

        if(!document.querySelector('.modal-body')) return

        let canvasWidth = windowSize.isMobile ? windowSize.width*0.8 : 400;

        const canvasModal = new fabric.Canvas('canvasModal', {
            width: canvasWidth,
            height: canvasWidth,
        })
        setCanvasModal(canvasModal)

    },[show, windowSize])

    const setOrder = (order)=>{
        const obj = canvas.getActiveObject()
        if(!obj) return
        if(order === 'top') obj.bringToFront();
        if(order === 'bottom') obj.sendToBack();
    }

    // Customize Fabric Deletion Icon & functions
    const initDeleteIcon = ()=>{
         const deleteImg = document.createElement('img');
         deleteImg.src = './images/close-circle-outline.svg';
         deleteImg.classList.add('deleteBtn');

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

    const reset = ()=>{
        canvas.clear();

        fabric.Image.fromURL(props.bgImages[0].src, function (img) {
            img.scaleToWidth(canvas.width);
            img.scaleToHeight(canvas.height);
            canvas.setBackgroundImage(img);
            canvas.requestRenderAll();
        });
    }

    const setBg = (src)=>{
        if(!canvas) return ;
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

    const renderStickers = ()=>{
        return props.stickers.map(image=>{
            return (
                <img onClick={()=>addSticket(image.src)} role="button" key={image.alt} src={image.src} className="img-thumbnail sticker" alt={image.alt} />
            )
        })
    }

    const downloadResult = ()=>{
        const image = canvas.toDataURL({multiplier: 5});
            const a = document.createElement('a');
            a.href = image;
            a.download = `newyear2024.jpeg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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
                    "selectable": false,
                    "evented": false
                });

                image.scaleToWidth(canvasModal.width);
                canvasModal.setHeight(image.height*image.scaleY)

                setUploadImage(image)
                canvasModal.add(image).setActiveObject(image).renderAll();
            }
    }

    const addClip = ()=>{
        let userClipPath;
        if(uploadClipPath){
            setUploadClipPath('')
            canvasModal.getObjects().forEach(obj=>{
                if(obj.id === 'circleClip' ||obj.id === 'bgClip' ) {
                    canvasModal.remove(obj)
                }
            })

        }
        if(modalType === 'photo'){
            userClipPath = new fabric.Circle({
                top: uploadImage.getBoundingRect().top,
                left: uploadImage.getBoundingRect().left,
                radius: 50,
                width: 100,
                height: 100,
                fill: 'rgb(178, 178, 178, 0.4)',
                id: 'circleClip',
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
                id: 'bgClip',
            })
        }

        canvasModal.add(userClipPath).setActiveObject(userClipPath).renderAll();
        setUploadClipPath(userClipPath);
    }

    const clipImage = ()=>{
        const imageCenter = {
            top: uploadImage.getBoundingRect().top + uploadImage.height * uploadImage.scaleY / 2,
            left: uploadImage.getBoundingRect().left + uploadImage.width * uploadImage.scaleX / 2,
        }

        if(modalType === 'photo'){
            uploadImage.set({
                clipPath: new fabric.Circle({
                    radius: uploadClipPath.radius / uploadImage.scaleX * uploadClipPath.scaleX,
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
                    width: uploadClipPath.width / uploadImage.scaleX * uploadClipPath.scaleX,
                    height:uploadClipPath.height / uploadImage.scaleY * uploadClipPath.scaleY,
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
            if(modalType==='bg') setBg(modifiedImage);
            if(modalType==='photo'){
                pasteImage.src = modifiedImage;
                pasteImage.onload = function () {
                    const image = new fabric.Image(pasteImage);
                    image.set({
                        left: 100,
                        top: 60,
                        objectCaching: false,

                    });
                    // image.scaleToWidth();
                    canvas.add(image).setActiveObject(image).renderAll();

                }
            }
        }

        if(canvasModal){
            resetCanvasModal()
            setShow(false)
        }

    }

    const addSticket = (stickerSrc) =>{
        if(stickerSrc){
            const pasteImage = new Image();

            pasteImage.src = stickerSrc;
            pasteImage.onload = function () {
                const image = new fabric.Image(pasteImage);
                image.set({
                    left: 20,
                    top: 60,
                    objectCaching: false,
                });
                image.scaleToWidth(canvasDefaultWidth * 0.8);
                canvas.add(image).setActiveObject(image).renderAll();
            }

        }
    }

    const resetCanvasModal= ()=>{
        const upload = document.querySelector('#imageUpload')
        if(upload?.value) upload.value = ''
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
                fontFamily: font,
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
            <button onClick={addClip} type="button" className="btn btn-light">{renderText('btn_add_clip')}</button>
            <button onClick={clipImage} type="button" className="btn btn-light">{renderText('btn_clip_photo')}</button>
           </>

        )
        else return(
            <button onClick={addClip} type="button" className="btn btn-light">{renderText('btn_add_clip')}</button>
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

    const renderText = (key)=>{
        if (!Object.keys(language).length) return;
        return textByLan[language][key];
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
                            <div className={thumbnailClass()}>
                                {renderBgImages()}
                            </div>
                            <div className="d-flex flex-column align-items-start mt-4 h-50">

                                <div className="mt-2 mb-auto">
                                    <button onClick={()=>showModal('photo')} type="button" className="btn_f" data-bs-toggle="modal"
                                        data-bs-target="#exampleModal">
                                        {renderText('btn_add_photo')}
                                    </button>
                                    <button onClick={()=>showModal('bg')} type="button" className="btn_f ms-2" data-bs-toggle="modal"
                                        data-bs-target="#exampleModal">
                                        {renderText('btn_add_bg')}
                                    </button>
                                    <div className="mt-2">
                                        <button onClick={()=>setOrder('top')} type="button" className="btn_s" data-bs-toggle="modal"
                                            data-bs-target="#exampleModal">
                                            {renderText('btn_send_top')}
                                        </button>
                                        <button onClick={()=>setOrder('bottom')} type="button" className="btn_s ms-2" data-bs-toggle="modal"
                                            data-bs-target="#exampleModal">
                                            {renderText('btn_send_bottom')}
                                        </button>

                                    </div>
                                    <div className="mt-2">
                                        {renderStickers()}
                                    </div>

                                    <div className="mt-3">
                                        <div className="d-flex mb-1">
                                            <select name="cars" id="font" onChange={(e)=>setFont(e.target.value)}>
                                                <option value="Noto Sans TC">Noto Sans TC</option>
                                                <option value="Noto Serif TC">Noto Serif TC</option>
                                            </select>
                                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                                                   style={{height: '35px', width: '35px'}} className="mx-2"/>
                                        </div>
                                        <div className="d-flex">
                                            <input type="text" className="col w-75 me-2" id="text_input"/>
                                            <button onClick={addText} type="button" className="btn_f"
                                                    id="add_text_btn">{renderText('btn_add_text')}</button>
                                        </div>
                                    </div>

                                </div>

                                <div className="d-flex flex-wrap mt-2">
                                    <button onClick={reset} type="button" className="btn_g mt-2">{renderText('btn_reset')}</button>
                                    <button onClick={downloadResult} className="btn_l ms-2 mt-2" type="button">{renderText('btn_download')}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    </div>
                    <div className="position-absolute d-flex align-items-end logo_wrap">
                        <h2>{renderText('title')}</h2>
                    </div>
                     <Footer />
                </main>
                <CustomModal
                    show={show}
                    handleClose={handleClose}
                    resetModal={resetCanvasModal}
                    addPhoto={addPhoto}
                    title={modalTitle}
                    isSaveDisabled={uploadClipPath && !isCropped}
                    saveText={renderText('modal_btn_save_change')}
                    resetText={renderText('btn_reset')}
                    tooptipText={renderText('modal_alert')}
                    size="lg">
                    <Form.Group  onChange={uploadPhoto} className={`mb-3 ${uploadImage ? 'd-none' : ''}`}>
                        <Form.Control type="file" id="imageUpload" accept="image/*"/>
                    </Form.Group>
                   <div>{renderClipIcon()}</div>
                   <canvas id="canvasModal" className="mx-auto"></canvas>
                </CustomModal>
            </div>
        )

}



export default NewYearCanvas
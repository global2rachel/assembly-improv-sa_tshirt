import React, {useEffect, useState } from "react";
import { fabric } from "fabric";
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewYearCanvas.css';
import CustomModal from "./CustomModal";
import {Form} from "react-bootstrap";
import { useWindowSize } from "./WindowResize";
import textByLan from "../text-translation.json";
import Footer from "./Footer";
import TshirtComponent from './assembly/tshirt';
import LogoWhiteComponent from './assembly/LogoWhite';
import { Canvg } from 'canvg';
import { Button } from 'react-bootstrap';

const NewYearCanvas = (props)=>{
    const [language, setLanguage] = useState({});
    const [canvas, setCanvas] = useState('');
    const [canvasModal, setCanvasModal] = useState('');
    const [uploadImage, setUploadImage] = useState('');
    const [uploadClipPath, setUploadClipPath] = useState('');
    const [isCropped, setIsCropped] = useState(false);

    const [color, setColor] = useState('#000000');
    const [colorName, setColorName] = useState('black');

    const [show,setShow] = useState(false);

    const [logoType, setLogo] = useState(null);
    const [logoSrc, setLogoSrc] = useState('');

    const [modalType,setModalType] = useState('');
    const [modalTitle,setModalTitle] = useState('');
    
    const [lightColor,setLightColor] = useState(null);
    const [outlineColor,setOutlineColor] = useState(null);

    const canvasDefaultWidth = 300;
    const showModal = (type)=> {
        setModalType(type);
        type ==='bg' ? setModalTitle(renderText('btn_add_bg')):setModalTitle(renderText('btn_add_photo'));
        setShow(true);
    }
    const handleClose = ()=> {
        setShow(false);
    }
    const windowSize = useWindowSize();

    useEffect(()=>{

        // if(!document.querySelector('.modal-body')) return

        // let canvasWidth = windowSize.isMobile ? windowSize.width*0.8 : 400;

        // const canvasModal = new fabric.Canvas('canvasModal', {
        //     width: canvasWidth,
        //     height: canvasWidth,
        // })
        // setCanvasModal(canvasModal)

    },[show, windowSize])

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

    const renderLogos = ()=>{
        return props.stickers.map(image=>{
            return (
                <img onClick={()=>setLogoAttribute(image)} role="button" key={image.alt} src={image.src} className="img-thumbnail sticker" alt={image.alt} />
            )
        })
    }

    const setLogoAttribute = (image)=>{
        setLogo(image.alt);
        setLogoSrc(image.src);
    }

    const downloadResult = ()=>{
        const editedLogo = document.getElementById('edited_logo');

        const copiedNode = editedLogo.cloneNode(true);
        copiedNode.setAttribute('width', '2000'); 
        document.body.appendChild(copiedNode);

        // Serialize the SVG into a string
            const svgData = new XMLSerializer().serializeToString(copiedNode);

            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = copiedNode.clientWidth;
            canvas.height = copiedNode.clientHeight;

            const ctx = canvas.getContext('2d');

            // Initialize Canvg and render the SVG string onto the canvas
        const renderSVG = async () => {
            const canvgInstance = Canvg.fromString(ctx, svgData);
            await canvgInstance.render();  // Wait for rendering to finish
        };

        // Call the function to render the SVG
        renderSVG();


        const image = canvas.toDataURL({multiplier: 5});
        const a = document.createElement('a');
        a.href = image;
        a.download = `logo.png`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        document.body.removeChild(copiedNode);
    }

    const uploadPhoto = (e)=>{
            const uploadImageTmp = new Image();
            const imageContainer = document.getElementById('imageContainer');
            uploadImageTmp.src = URL.createObjectURL(e.target.files[0]);
            uploadImageTmp.onload = function () {
                // const img = document.createElement('img');
                // img.src = e.target.result; // Set the image source to the file content
                uploadImageTmp.alt = 'Uploaded Image'; 
                uploadImageTmp.style.width = '300px';

                // Clear previous images
                imageContainer.innerHTML = '';

                // Add the new image to the DOM
                imageContainer.appendChild(uploadImageTmp);

                setLogo('custom-file');
            }
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

    const rightSecClass=()=>{
        let width =
               window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth
        return (
            `col-md-4 col-12 flex-column ${width > 767 ? 'mt-5 pt-5' : 'mt-4'} px-2`
        )
    }

    const thumbnailClass = ()=>{
        let width =
               window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth
        return (
            `d-flex  ${width > 767 ? '' : 'justify-content-center'} flex-wrap mt-3`
        )
    }

    const renderText = (key)=>{
        if (!Object.keys(language).length) return;
        return textByLan[language][key];
    }

    const renderTshirtColors = ()=>{
        return props.colors.map((colorItem, index)=>{
            return (
                <div onClick={()=>setShirtColor(colorItem)} key={index} className="tshirt-color" style={{backgroundColor: colorItem.colorCode}}></div>
            )
        });
    }

    const setShirtColor = (colorItem)=>{
        setColor(colorItem.colorCode);
        setColorName(colorItem.colorName);
    }

    const resetLogo = ()=>{
        setOutlineColor('#000000');
        setLightColor('#000000');
    }

    const renderMockupLogos = ()=>{
        if(!logoType || logoType === 'custom-file') return;
        return (
            <div className="position-absolute logo">
                                            <img className="mockup-logo" src={logoSrc} alt="logo"></img>
                                        </div>
        )
    }

        return(
            <div>
                <main className="custom container-fluid position-relative">
                    <div className="custom_page d-flex justify-content-center flex-wrap">
                        {/* Edit Board */}
                        <div className="d-flex flex-wrap">
                             {/* Left */}
                            <div className="col-md-8 col-12 mat_space d-flex align-items-center justify-content-center">
                                <div className="position-relative">
                                    <TshirtComponent color={color}/>

                                    { renderMockupLogos() }
                                     
                                    <div id="imageContainer" className="position-absolute logo"></div>
                                </div>
                            </div>
                            {/* Right */}
                            <div className={rightSecClass()} style={{height:'500px'}}>

                                <h3>Logo Type:</h3>
                                <div className="mt-3">
                                    {renderLogos()}
                                    <button onClick={()=>showModal('photo')} type="button" className="btn_f mx-4" data-bs-toggle="modal"
                                            data-bs-target="#exampleModal">
                                            Edit Logo
                                    </button>
                                </div>

                                <div className="my-2">
                                    <h3>Upload your logo:</h3>
                                    <Form.Group  onChange={uploadPhoto} className="mt-3">
                                        <Form.Control type="file" id="imageUpload" accept="image/*"/>
                                    </Form.Group>
                                </div>

                                <h3 className="mb-2">T-shirt Color:</h3>
                                <div className={thumbnailClass()}>
                                    { renderTshirtColors() }
                                </div>

                                <div className="d-flex flex-column align-items-start mt-4">
                                    <div>
                                        <h3>Your Assembly Improv T-shirt Order</h3><br/>
                                        T-shirt Color: {colorName} <br/>
                                        Logo Name: {logoType}
                                        <div className="d-flex flex-wrap mt-2">
                                            <Button size ="lg" type="button" className="mt-2" target="_blank" href="https://docs.google.com/spreadsheets/d/1zgp-BohPWzhyPIMvdyBpfuje7yM_3jPi7fd0s2LphKk/edit?usp=sharing">Place your order!</Button>
                                            {/* <button onClick={reset} type="button" className="btn_g mt-2">{renderText('btn_reset')}</button> */}
                                            {/* <button onClick={downloadResult} className="btn_l ms-2 mt-2" type="button">{renderText('btn_download')}</button> */}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Title */}
                    <div className="position-absolute d-flex align-items-end logo_wrap p-1">
                        <h1>Your Assembly Improv T-Shirt</h1>
                    </div>

                     <Footer />
                </main>

                <CustomModal
                    show={show}
                    handleClose={handleClose}
                    addPhoto={downloadResult}
                    resetModal={resetLogo}
                    title="Customize Logo"
                    isSaveDisabled={uploadClipPath && !isCropped}
                    saveText="Download Image"
                    resetText="Reset"
                    size="lg">

                    <div className="d-flex">
                        <div className="model-input">
                            <h3 className="mb-2">Light Color:</h3>
                            <label id="colorPicker"></label>
                            <input id="colorPicker" type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)}
                                style={{ height: '35px', width: '35px' }} className="mx-2" />
                        </div>

                        <div className="model-input">
                            <h3 className="mb-2">Outline Color:</h3>
                            <input type="color" value={outlineColor} onChange={(e) => setOutlineColor(e.target.value)}
                                style={{ height: '35px', width: '35px' }} className="mx-2" />
                        </div>
                    </div>

                    <LogoWhiteComponent className="position-absolute logo" lightcolor={lightColor} outlinecolor={outlineColor}></LogoWhiteComponent>

                </CustomModal>

            </div>
        )

}



export default NewYearCanvas
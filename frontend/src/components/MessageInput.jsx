import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {

    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInuptRef = useRef(null); //useRef for getting the file input ref
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInuptRef.current) fileInuptRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            // clear the form
            setText("");
            setImagePreview(null);
            if (fileInuptRef.current) fileInuptRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message: ", error);
        }
    }


    return (
        <div className='p-4 w-full'>

            {/* For previewing the image on chat screen means before sending the image to the other user*/}
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}


            <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
                <div className='flex-1 flex gap-2'>
                    {/* for text part */}
                    <input type='text'
                        className='w-full input input-bordered rounded-lg input-sm 
          sm:input-md' placeholder='Type a message...' value={text}
                        onChange={(e) => setText(e.target.value)} />

                    {/* for image part */}
                    <input type='file' accept='image/*' className='hidden' //it is hidden as it shows that "Choose file" option that's why but it works still
                        ref={fileInuptRef} onChange={handleImageChange} />

                    {/* if image is selected then the green color enabled */}
                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInuptRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>




                </div>

                {/* button for submitting */}
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={22} />
                </button>
            </form>



        </div>
    )
}

export default MessageInput

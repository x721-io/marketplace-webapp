import React from "react";

type Props = {
    width?: number;
    height?: number;
};

const DollarUpIcon = ({ width, height }: Props) => {
    return (
        <div>
            <svg width={width} height={height} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="34" height="34" rx="12" fill="#F5F5F5"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17 8C17.4142 8 17.75 8.33579 17.75 8.75V25.25C17.75 25.6642 17.4142 26 17 26C16.5858 26 16.25 25.6642 16.25 25.25V8.75C16.25 8.33579 16.5858 8 17 8Z" fill="#252525"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7385 11.9885C13.3714 11.3556 14.2299 11 15.125 11H20.75C21.1642 11 21.5 11.3358 21.5 11.75C21.5 12.1642 21.1642 12.5 20.75 12.5H15.125C14.6277 12.5 14.1508 12.6975 13.7992 13.0492C13.4475 13.4008 13.25 13.8777 13.25 14.375C13.25 14.8723 13.4475 15.3492 13.7992 15.7008C14.1508 16.0525 14.6277 16.25 15.125 16.25H18.875C19.7701 16.25 20.6286 16.6056 21.2615 17.2385C21.8944 17.8715 22.25 18.7299 22.25 19.625C22.25 20.5201 21.8944 21.3786 21.2615 22.0115C20.6286 22.6444 19.7701 23 18.875 23H12.5C12.0858 23 11.75 22.6642 11.75 22.25C11.75 21.8358 12.0858 21.5 12.5 21.5H18.875C19.3723 21.5 19.8492 21.3025 20.2008 20.9508C20.5525 20.5992 20.75 20.1223 20.75 19.625C20.75 19.1277 20.5525 18.6508 20.2008 18.2992C19.8492 17.9475 19.3723 17.75 18.875 17.75H15.125C14.2299 17.75 13.3714 17.3944 12.7385 16.7615C12.1056 16.1286 11.75 15.2701 11.75 14.375C11.75 13.4799 12.1056 12.6214 12.7385 11.9885Z" fill="#252525"/>
            </svg>


        </div>
    );
};

export default DollarUpIcon;
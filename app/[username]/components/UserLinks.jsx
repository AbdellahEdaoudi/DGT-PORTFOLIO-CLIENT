"use client";
import React from "react";
import { Link as LinkIcon, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";

function UserLinks({ userLinks = [],language,labels}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className=" px-2 hover:cursor-pointer flex items-center justify-center sm:justify-start md:justify-start gap-2">
          <LinkIcon width={18} />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="sr-only">Business Links</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="rounded-lg text-black">
              <div className="flex items-center justify-between mx-3 text-3xl font-semibold text-center text-gray-800 mb-4">
               <span>Business Links</span>
              <AlertDialogCancel><X /></AlertDialogCancel>
              </div>

              <div className="p-2 space-y-3 overflow-y-auto scrollbar-non max-h-96">
                <div className="p-2 space-y-3">
                  {userLinks.length > 0 ? (
                    userLinks.map((lnk, i) => (
                      <a dir={`${language === "ar" && "rtl"}`}
                        href={lnk.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={i}
                        className="flex border border-gray-300 shadow-md duration-300 hover:bg-gray-100 pl-3 items-center gap-2 rounded-lg p-2"
                      >
                        <p className="p-2 border border-gray-300 rounded-full text-teal-600">
                          <LinkIcon />
                        </p>
                        <p className="text-sm break-all">{lnk.namelink}</p>
                      </a>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No Business Links available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* <AlertDialogCancel>Close</AlertDialogCancel> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UserLinks;

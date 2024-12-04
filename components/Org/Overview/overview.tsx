"use client";

import { useEffect, useState } from "react";
import { Element, ElementType } from "../types";
import AddOverviewSectionModal from "./add-ov-section-modal";
import Section from "./section";
import EditOverviewSectionModal from "./edit-ov-section-modal";

export default function OrgOverview({
  overviewElements,
  editMode = true,
}: {
  overviewElements: Element[];
  editMode?: boolean;
}) {
  const [isShowAddSectionModal, setShowAddSectionModal] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [draftedElements, setDraftedElements] = useState<Element[]>([
    ...overviewElements,
  ]);

  const handleAddNewElement = (element: Element) => {
    setDraftedElements((prev) => [...prev, element]);
    setShowAddSectionModal(false);
  };

  const handleMoveDown = (index: number) => {
    const newElements = [...draftedElements];
    const element = newElements.splice(index, 1)[0];
    newElements.splice(index + 1, 0, element);
    setDraftedElements(newElements);
  };

  const handleMoveUp = (index: number) => {
    const newElements = [...draftedElements];
    const element = newElements.splice(index, 1)[0];
    newElements.splice(index - 1, 0, element);
    setDraftedElements(newElements);
  };

  const handleDelete = (index: number) => {
    const newElements = [...draftedElements];
    newElements.splice(index, 1);
    setDraftedElements(newElements);
  };

  const handleOnEdit = (index: number) => {
    setEditIndex(index);
  };

  const handleUpdateElement = (path: string, updatedElement: Element) => {
    const updatedDraftedElements = [...draftedElements];
    const indices = path.split("-").map(Number);
    let currentItem = updatedDraftedElements;
    for (let i = 0; i < indices.length - 1; i++) {
      if (currentItem[indices[i]] && currentItem[indices[i]].children) {
        currentItem = currentItem[indices[i]].children ?? [];
      } else {
        console.error("Invalid path");
        return;
      }
    }
    const finalIndex = indices[indices.length - 1];
    if (currentItem[finalIndex]) {
      delete updatedElement.path;
      currentItem[finalIndex] = updatedElement;
    } else {
      console.error("Invalid path at the final index");
    }
    setDraftedElements(updatedDraftedElements);
  };

  const handleUpdateBG = (
    newBG: string,
    index: number,
    type: "color" | "image"
  ) => {
    const updatedDraftedElements = [...draftedElements];
    if (updatedDraftedElements[index].type === ElementType.CONTAINER) {
      switch (type) {
        case "color":
          updatedDraftedElements[index].background = newBG;
          break;
        case "image":
          updatedDraftedElements[index].backgroundImage = newBG;
          break;
        default:
      }
    }
    setDraftedElements(updatedDraftedElements);
  };

  return (
    <div className="w-full relative flex flex-col gap-10">
      <div className="w-full relative flex flex-col">
        {draftedElements.map((e, i) => (
          <Section
            onEdit={handleOnEdit}
            onMoveDown={handleMoveDown}
            onMoveUp={handleMoveUp}
            onDelete={handleDelete}
            key={i}
            element={e}
            index={i}
          />
        ))}
      </div>
      {editMode && (
        <div className="w-full flex justify-center py-10">
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="bg-[#000000] text-[#ffffff] py-2 px-5 rounded-full"
          >
            Add new section
          </button>
        </div>
      )}
      <EditOverviewSectionModal
        onClose={() => setEditIndex(-1)}
        element={editIndex !== -1 ? draftedElements[editIndex] : null}
        isShow={editIndex !== -1}
        index={editIndex}
        onUpdateBackgroundColor={(newBG: string) =>
          handleUpdateBG(newBG, editIndex, "color")
        }
        onUpdateBackgroundImage={(newBG: string) =>
          handleUpdateBG(newBG, editIndex, "image")
        }
        onUpdateElement={handleUpdateElement}
      />
      <AddOverviewSectionModal
        onClose={() => setShowAddSectionModal(false)}
        onAddNewElement={handleAddNewElement}
        isShow={isShowAddSectionModal}
      />
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import { Element, ElementType } from "../types";
import EditOverviewSectionModal from "@/components/PageBuilder/Overview/CRUD/EditSectionModal";
import AddOverviewSectionModal from "@/components/PageBuilder/Overview/CRUD/AddOnSectionModal";
import CRUD from "@/components/PageBuilder/Overview/CRUD";

export default function OverviewTab({
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

  const handleAddNewElement = useCallback((element: Element) => {
    setDraftedElements((prev) => [...prev, element]);
    setShowAddSectionModal(false);
  }, []);

  const handleMoveDown = useCallback((index: number) => {
    setDraftedElements((prev) => {
      if (index < prev.length - 1) {
        const newElements = [...prev];
        const [movedElement] = newElements.splice(index, 1);
        newElements.splice(index + 1, 0, movedElement);
        return newElements;
      }
      return prev;
    });
  }, []);

  const handleMoveUp = useCallback((index: number) => {
    setDraftedElements((prev) => {
      if (index > 0) {
        const newElements = [...prev];
        const [movedElement] = newElements.splice(index, 1);
        newElements.splice(index - 1, 0, movedElement);
        return newElements;
      }
      return prev;
    });
  }, []);

  const handleDelete = useCallback((index: number) => {
    setDraftedElements((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 1);
      return newElements;
    });
  }, []);

  const handleOnEdit = useCallback((index: number) => {
    setEditIndex(index);
  }, []);

  const handleUpdateElement = useCallback(
    (path: string, updatedElement: Element) => {
      setDraftedElements((prev) => {
        const updatedDraftedElements = [...prev];
        const indices = path.split("-").map(Number);
        let currentItem = updatedDraftedElements;
        for (let i = 0; i < indices.length - 1; i++) {
          if (currentItem[indices[i]] && currentItem[indices[i]].children) {
            currentItem = currentItem[indices[i]].children ?? [];
          } else {
            console.error("Invalid path");
            return prev;
          }
        }
        const finalIndex = indices[indices.length - 1];
        if (currentItem[finalIndex]) {
          delete updatedElement.path;
          currentItem[finalIndex] = updatedElement;
        } else {
          console.error("Invalid path at the final index");
        }
        return updatedDraftedElements;
      });
    },
    []
  );

  const handleUpdateBG = useCallback(
    (newBG: string, index: number, type: "color" | "image") => {
      setDraftedElements((prev) => {
        const updatedDraftedElements = [...prev];
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
        return updatedDraftedElements;
      });
    },
    []
  );

  return (
    <div className="w-full relative flex flex-col gap-10">
      <div className="w-full relative flex flex-col">
        {draftedElements.map((e, i) => (
          <CRUD
            onEdit={() => handleOnEdit(i)}
            onMoveDown={() => handleMoveDown(i)}
            onMoveUp={() => handleMoveUp(i)}
            onDelete={() => handleDelete(i)}
            key={i}
            element={e}
            index={i}
          />
        ))}
      </div>
      {editMode && (
        <div className="w-full hidden tablet:flex justify-center py-10 ">
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

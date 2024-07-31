"use client"
import React, {Fragment, useEffect, useState} from "react";
import MenuItemDto, {menuItemHeaders} from "../../../lib/models/menu/MenuItemDto";
import {Button, Input, Spinner, useDisclosure} from "@nextui-org/react";
import HttpServices from "../../../lib/HttpServices";
import {useAuth} from "../../AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons/faFolderPlus";
import Modals from "../../../components/CustomModal";
import {toast} from "react-toastify";

export default function MenuItemComponent() {
    const [menuItem, setMenuItem] = useState<BasicDto<MenuItemDto>>(
        {
            error    : "",
            isSuccess: false,
            value    : {
                amount   : 0,
                resultDto: [{
                    id                 : 0,
                    name               : ""
                }]
            }
        });


    const httpServices = new HttpServices();
    const {token} = useAuth();
    const [editObj, setEditObj] = useState<MenuItemDto>(
        {
            id               : 0,
            name             : ""
        }
    );
    const [editModal, setEditModal] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const {
        isOpen,
        onOpen,
        onClose,
        onOpenChange
    } = useDisclosure();

    const menuItemAPI: string = "/DataManagement/menu-item";

    useEffect(() => {
        (async () => {
            const server_res = await retrieveMenuItem({
                id  : null,
                name: null
            });

            if (!server_res) {
                throw new Error("Failed to retrieve menu item.");
            }

            if (!server_res.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }

            setMenuItem(server_res);
            
            setIsLoading(false);
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed");
            }
        });
    }, []);

    const showToast = (message: string) => {
        toast(message);
    }

    const createMenuItem = async function () {
        try {
            const response = await (await httpServices.callAPI(`${menuItemAPI}/creation`, {
                id  : null,
                name: newName
            }, "POST", token)).json();
            return response as BasicDto<MenuItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }


    const retrieveMenuItem = async function (menuItemQuery: MenuItemQueryDto) {
        try {
            const response = await (await httpServices.callAPI(`${menuItemAPI}/read`, menuItemQuery, "POST", token)).json();
            return response as BasicDto<MenuItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const updateMenuItem = async function (menuItemQuery: MenuItemQueryDto) {
        try {
            const response = await (await httpServices.callAPI(`${menuItemAPI}/update`, menuItemQuery, "POST", token)).json();
            return response as BasicDto<MenuItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const deleteMenuItem = async function (id: number) {
        try {
            const response = await (await httpServices.callAPI(`${menuItemAPI}/${id}`, {}, "DELETE", token)).json();
            return response as BasicDto<MenuItemDto>;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        }
    }

    const handleEdit = (id: number) => {
        setEditModal(true);
        (async () => {
            const server_res = await retrieveMenuItem({
                id  : id,
                name: null
            });
            if (!server_res) {
                throw new Error("Failed to retrieve menu item.");
            }
            if (!server_res.isSuccess) {
                throw new Error("failed to retrieve menu with id");
            }

            const existingMenuItem: MenuItemDto | undefined = (server_res.value.resultDto as MenuItemDto[]).pop();

            if (!existingMenuItem) {
                throw new Error("Existing menu is null.");
            }
            setEditObj(existingMenuItem);
            onOpen();
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        });
    }

    const handleDelete = (id: number) => {
        (async () => {
            const server_res = await deleteMenuItem(id);
            if (!server_res) {
                throw new Error("Failed to delete menu item.");
            }
            if (!server_res.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }
            const updatedList = await retrieveMenuItem({
                id  : null,
                name: null
            });

            if (!updatedList) {
                throw new Error("Failed to retrieve menu item.");
            }

            if (!updatedList.isSuccess) {
                throw new Error(`Fail - ${updatedList.error}`);
            }

            setMenuItem(updatedList);
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        });
    }

    const handleCreate = () => {
        setEditModal(false);
        onOpen();
    }

    const insertName = (name: string) => {
        const {id} = editObj;
        setEditObj({
            id               : id,
            name             : name
        });
    }

    const createName = (name: string) => {
        setNewName(name);
    }

    const cancelEdition = () => {
        onClose();
    }

    const confirmEdition = () => {
        const {id} = editObj;

        (async () => {
            const server_res = await updateMenuItem({
                id  : id,
                name: newName
            });

            if (!server_res) {
                throw new Error("Update menu failed");
            }

            if (!server_res.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }

            const menuReadResponse = await retrieveMenuItem({
                id  : null,
                name: null
            });

            if (!menuReadResponse) {
                throw new Error("Retrieve updated menu failed");
            }

            if (!menuReadResponse.isSuccess) {
                throw new Error(`Fail - ${menuReadResponse.error}`);
            }
            setMenuItem(menuReadResponse);
            onClose();
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        });
    }

    const cancelCreation = () => {
        onClose();
    }

    const confirmCreation = () => {
        (async () => {
            const server_res = await createMenuItem();

            if (!server_res) {
                throw new Error("Failed to create menu item.");
            }

            if (!server_res.isSuccess) {
                throw new Error(`Fail - ${server_res.error}`);
            }

            const updatedMenuItemResponse = await retrieveMenuItem({
                id  : null,
                name: null
            });

            if (!updatedMenuItemResponse) {
                throw new Error("Failed to retrieved created menu item.");
            }

            if (!updatedMenuItemResponse.isSuccess) {
                throw new Error("Failed to create new menu item");
            }

            setMenuItem(updatedMenuItemResponse);
            onClose();
        })().catch(error => {
            if (error instanceof Error) {
                showToast(error.message);
            } else {
                showToast("Service crashed")
            }
        });
    }

    const renderContent = () => {
        if (editModal) {
            return (
                <>
                    <Input label={"Name"}
                           placeholder={editObj.name}
                           defaultValue={editObj.name}
                           onValueChange={(name) => insertName(name)}
                    />
                </>
            )
        } else {
            return (
                <Input label={"Name"}
                       placeholder={"Insert a name"}
                       onInput={(event) => createName(event.currentTarget.value)}
                       onValueChange={(value) => createName(value)}
                       onChange={(value) => createName(value.target.value)}
                />
            )
        }
    }

    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <>
            <div className={"w-full flex flex-row justify-end p-2"}>
                <Button variant={"solid"}
                        startContent={<FontAwesomeIcon icon={faFolderPlus}/>}
                        onClick={handleCreate}
                        className={"w-3/12"}
                        color={"success"}
                />
            </div>
            <div className={"grid grid-cols-4 w-full"}>
                {
                    menuItemHeaders.map((header) => (
                        <Fragment key={header}>
                            <div className={"font-extrabold gird-style text-center"}>
                                {header}
                            </div>
                        </Fragment>
                    ))
                }
                <Fragment key={"header_delete"}>
                    <div className={"font-extrabold gird-style text-center"}>
                        Delete
                    </div>
                </Fragment>
                <Fragment key={"header_edit"}>
                    <div className={"font-extrabold gird-style text-center"}>
                        Edit
                    </div>
                </Fragment>
                {
                    (menuItem.value.resultDto as MenuItemDto[]).map((menuItemDto) => {
                        return (
                            <Fragment key={`${menuItemDto.name}${menuItemDto.id}`}>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuItemDto.id}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    {menuItemDto.name}
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleDelete(menuItemDto.id)}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </div>
                                <div className={"p-4 gird-style text-center"}>
                                    <button onClick={() => handleEdit(menuItemDto.id)}>
                                        <FontAwesomeIcon icon={faPenToSquare}/>
                                    </button>
                                </div>
                            </Fragment>
                        )
                    })
                }
            </div>
            <Modals isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onCancel={() => editModal ? cancelEdition() : cancelCreation()}
                    onConfirm={() => editModal ? confirmEdition() : confirmCreation()}
                    header={editModal ? "Edit" : "Create"}
                    hideCloseButton={false}
            >
                {
                    renderContent()
                }
            </Modals>
        </>
    );
}
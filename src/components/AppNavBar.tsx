import * as React from 'react';
import MailIcon from '@mui/icons-material/Mail';
import { Accordion, AccordionDetails, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, } from '@mui/material';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useEffect, useState } from 'react';
//功能欄中的選單

export default function AppNavBar() {

    const [expanded, setExpanded] = useState<string | false>(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);

    const AccordionHandleChange =
        (panel: string) => async (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        }

    useEffect(() => {
        fetch('https://localhost:44373/Category')
            .then(response => response.json())
            .then(data => {
                // 處理返回的商品列表
                console.log(data);
                setAllCategories(data);
            })
            .catch(error => {
                console.error('發稱錯誤:', error);
            });
    }, []);
    console.log("p", allCategories)
    interface Category {
        categoryName: string;
        categoryId: string;
    }

    return (
        <>
            <Accordion expanded={expanded === 'panel1'} onChange={AccordionHandleChange('panel1')}>
                <AccordionDetails>
                    <div>
                        <div key={""}>
                            <Link href={`/Demo/ProductCategory?categoryId=${""}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ display: 'flex', alignItems: 'center', padding: '2px' }}>
                                    <div style={{ marginRight: '8px' }}>
                                        {<InboxIcon />}
                                        {/* {category.icon ? <IconComponent /> : <MailIcon />} */}
                                    </div>
                                    <div>{"All"}</div>
                                </div>
                            </Link>
                            <hr />
                        </div>
                        {allCategories.map((category, index) => (
                            <div key={category.categoryId}>
                                <Link href={`/Demo/ProductCategory?categoryId=${category.categoryId}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', padding: '2px' }}>
                                        <div style={{ marginRight: '8px' }}>
                                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                            {/* {category.icon ? <IconComponent /> : <MailIcon />} */}
                                        </div>
                                        <div>{category.categoryName}</div>
                                    </div>
                                </Link>
                                <hr />
                            </div>
                        ))}
                    </div>
                </AccordionDetails>
            </Accordion>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );
}

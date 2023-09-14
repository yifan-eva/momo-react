import * as React from 'react';
import MailIcon from '@mui/icons-material/Mail';
import { Accordion, AccordionDetails, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, } from '@mui/material';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useEffect, useState } from 'react';
import axios from 'axios';


//功能欄中的選單
export default function AppNavBar() {

    const [expanded, setExpanded] = useState<string | false>(false);
    // 新增狀態來存放商品分類資訊
    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    // 發送請求以獲取特定類別的商品列表
    const fetchCategoryProducts = async (categoryId: any) => {
        try {
            const response = await fetch(`https://localhost:44373/ProductCategory/${categoryId}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('發生錯誤:', response.statusText);
                return [];
            }
        } catch (error) {
            console.error('發生錯誤:', error);
            return [];
        }
    };

    const AccordionHandleChange =
        (panel: string) => async (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
            // if (isExpanded) {
            //     const categoryId = panel; // 假設面板名稱即為類別 ID
            //     const categoryProducts = await fetchCategoryProducts(categoryId);
            //     setCategories(categoryProducts);
            //   }
            // if (isExpanded) {
            //     try {

            //         // 發送請求獲取商品分類資訊
            //         const response = await fetch(`https://localhost:44373/ProductCategory/${panel}`);
            //         if (response.ok) {
            //             const data = await response.json();
            //             setCategories(data);
            //         } else {
            //             console.error('Error fetching categories:', response.statusText);
            //         }

            //         // 發送請求獲取所有類別資訊
            //         const allCategoriesResponse = await fetch('/https://localhost:44373/Category');
            //         if (allCategoriesResponse.ok) {
            //             const allCategoriesData = await allCategoriesResponse.json();
            //             setAllCategories(allCategoriesData);
            //         } else {
            //             console.error('Error fetching all categories:', allCategoriesResponse.statusText);
            //         }
            // } catch (error) {
            // console.error('Error fetching categories:', error);
            // }
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
        categoryId: number;
    }
    // useEffect(() => {
    //     //避免一直觸發到初始值[]
    //     // if (setExpanded !== true){
    //     (async() => {
    //         const response = await axios.get(
    //             `localhost:44373/ProductCategory/?client_id=${accessID}&query=${search}`,);
    //         const {results} = response.data
    //         // console.log(results);
    //         setList(results);
    //     })();
    // },[search]) 

    return (
        <>
            <Accordion expanded={expanded === 'panel1'} onChange={AccordionHandleChange('panel1')}>
                <AccordionDetails>
                    <div>
                        {allCategories.map((category, index) => (
                            <div key={category.categoryId}>
                                <Link href={`/Demo/Product?categoryId=${category.categoryId}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
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

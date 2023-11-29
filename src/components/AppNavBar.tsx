import * as React from 'react';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import CategoryIcon from '@mui/icons-material/Category';
import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, Link } from '@mui/material';

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
                console.error('發生錯誤:', error);
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
                        {/* 取出全部的商品 */}
                        <div key={""}>
                            <Link href={`/Demo/ProductCategory?categoryId=${""}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ display: 'flex', alignItems: 'center', padding: '2px' }}>
                                    <div style={{ marginRight: '8px' }}>
                                        {<InboxIcon />}
                                    </div>
                                    <div>{"All"}</div>
                                </div>
                            </Link>
                            <hr />
                        </div>
                        {/* 分類的商品選單 */}
                        {allCategories.map((category, index) => (
                            <div key={category.categoryId}>
                                <Link href={`/Demo/ProductCategory?categoryId=${category.categoryId}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', padding: '2px' }}>
                                        <div style={{ marginRight: '8px' }}>
                                            <CategoryIcon/>                                            
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
        </>
    );
}

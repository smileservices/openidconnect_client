import {debug} from "./utils";
export const DynamicTable = ({columns, data, clickSelect}) => {
    const columns_keys = Object.keys(columns);
    return (
        <table>
            <thead>
            <tr>
                {columns_keys.map((column_key, index) => (
                    <th key={index}>{columns[column_key]}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={index} onClick={() => clickSelect(item)}>
                    {columns_keys.map((column_key, columnIndex) => (
                        <td key={columnIndex}>{item[column_key]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};
import { ReactNode } from "react";

type Cell = {
  value: ReactNode,
  className?: string
}

interface TableProps {
  headers: Array<string>,
  rows: Array<Array<Cell>>
}

export default function Table({
  headers, rows
}: TableProps): React.JSX.Element {
  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto shadow-lg shadow-[rgba(0,0,0,0.4)]">
      <table className="bg-[#1b1b1f] w-full text-center">
        <thead>
          <tr>
            {headers.map((header, headerIndex) => (
              <th className={`
                py-2 px-4
                ${(headerIndex !== 0 && headerIndex !== headers.length - 1) ? 'border-x' : ''}
              `}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, rowIndex) => (
            <tr key={rowIndex}>
              {cells.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`
                      py-2 px-4 border-t
                      ${(cellIndex !== 0 && cellIndex !== cells.length - 1) ? 'border-x' : ''}
                      border-[white]
                      ${cell.className}
                    `}
                >
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
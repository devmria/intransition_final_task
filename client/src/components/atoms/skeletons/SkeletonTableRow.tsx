import { TableRow, TableCell, Skeleton } from "@mui/material";

type Props = {
  amount: number;
}

export const SkeletonTableRow = ({amount}: Props) => (
  <TableRow>
    {
      Array.from({ length: amount }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton variant="text" width={80} />
          </TableCell>
      ))
    }
  </TableRow>
);
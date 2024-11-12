const sortedOrderList = ['asc','desc'];

export const parseSortParams = ({sortBy, sortOrder}, sortByList) => {
   const parsedSortOrder = sortedOrderList.includes(sortOrder) ? sortOrder : "asc" ;
   const parsedSortBy = sortByList.includes(sortBy) ? sortBy : 'id';

   return {
      sortBy:parsedSortBy,
      sortOrder:parsedSortOrder
   };

};


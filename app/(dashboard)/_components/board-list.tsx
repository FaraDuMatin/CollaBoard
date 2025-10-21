"use client";


interface BoardListProps {
    orgId: string;
    query: {
        search?: string;
        favorites?: string;
    };
}

const BoardList = ({ orgId, query }: BoardListProps) => {
    const data = []  // TODO : change to API call

    if (!data.length && query.search) {
        return (
            <div>
                <h2>No boards found for this search</h2>
            </div>
        );
    }
    return (
        <div>
            <h2>Board List</h2>
            <p>Organization ID: {orgId}</p>
            <p>Search Query: {query.search}</p>
            <p>Favorites: {query.favorites}</p>
        </div>
    );
};

export default BoardList;
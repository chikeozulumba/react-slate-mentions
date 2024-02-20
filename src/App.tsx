import { useState } from 'react'
import './App.css'
import { Editor } from './components'
import { EDITOR_INITIAL_STATE } from './constants';

interface Props {
  initialValue?: any;
  placeholder?: string;
}

function App({ initialValue = EDITOR_INITIAL_STATE, ...props }: Props) {

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hashTags, setHashTags] = useState<{ key: string; label: string }[]>(
    []
  );

  async function handleHashtagSelected(data: { key: string; label: string }) {
    setHashTags([data, ...hashTags]);
  }

  const allHashTagsAsLabels = hashTags.map((hashTag) =>
    hashTag.label.toLowerCase()
  );

  const handleDescriptionOnChange = (descriptionData: any[]) => {
    console.log("description", descriptionData);
  };

  return (
    <div>
      <Editor
        placeholder={props.placeholder}
        hashTagEnabled
        uniqueHashTags
        hashTags={hashTags}
        isHasTagSearching={isLoading}
        handleSearch={setSearchTerm}
        hashTagItems={[]
          .map(({ name, id }: any) => ({
            key: id,
            label: name.toLowerCase(),
          }))
          .filter(
            (hashTag: any) =>
              !allHashTagsAsLabels.includes(hashTag.label)
          )}
        searchContainerClassName="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-[200px] overflow-y-hidden w-full max-w-[200px] transition ease-out duration-100 transform opacity-100 scale-100"
        searchMenuItemClassName="text-sm leading-6 flex items-center justify-between overflow-hidden p-2 text-sm whitespace-nowrap truncate overflow-hidden cursor-pointer hover:bg-primary-light/10 hover:text-black"
        elementClassName="font-medium text-primary mr-1"
        handleHashtagSelected={handleHashtagSelected}
        handleOnChange={handleDescriptionOnChange}
        initialValue={initialValue}
      />
    </div>
  )
}

export default App

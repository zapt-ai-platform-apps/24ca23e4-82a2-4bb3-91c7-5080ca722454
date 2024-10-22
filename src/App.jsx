import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { SolidMarkdown } from "solid-markdown";

function App() {
  const [facts, setFacts] = createSignal([]);
  const [newFact, setNewFact] = createSignal({ title: '', description: '' });
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [generatedImage, setGeneratedImage] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [markdownText, setMarkdownText] = createSignal('');

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const fetchFacts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/getFacts', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setFacts(data);
    } else {
      console.error('Error fetching facts:', response.statusText);
    }
  };

  const saveFact = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/saveFact', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFact()),
      });
      if (response.ok) {
        const savedFact = await response.json();
        setFacts([...facts(), savedFact]);
        setNewFact({ title: '', description: '' });
      } else {
        console.error('Error saving fact');
      }
    } catch (error) {
      console.error('Error saving fact:', error);
    }
  };

  createEffect(() => {
    if (user()) {
      fetchFacts();
    }
  });

  const handleGenerateFact = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: 'Provide an interesting fact about Earth in JSON format with the following structure: { "title": "Fact title", "description": "Detailed description of the fact" }',
        response_type: 'json'
      });
      setNewFact(result);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const result = await createEvent('generate_image', {
        prompt: 'A breathtaking image of Earth from space'
      });
      setGeneratedImage(result);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    setLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: `${newFact().title}: ${newFact().description}`
      });
      setAudioUrl(result);
    } catch (error) {
      console.error('Error converting text to speech:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkdownGeneration = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: 'Write a short, informative story about Earth in markdown format',
        response_type: 'text'
      });
      setMarkdownText(result);
    } catch (error) {
      console.error('Error generating markdown:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="h-full bg-gradient-to-br from-green-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-green-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                showLinks={false}
                view="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-6xl mx-auto h-full">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-green-600">Earth Facts</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="col-span-1 md:col-span-2 lg:col-span-1">
              <h2 class="text-2xl font-bold mb-4 text-green-600">Add New Fact</h2>
              <form onSubmit={saveFact} class="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newFact().title}
                  onInput={(e) => setNewFact({ ...newFact(), title: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent box-border"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newFact().description}
                  onInput={(e) => setNewFact({ ...newFact(), description: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent box-border"
                  required
                />
                <div class="flex space-x-4">
                  <button
                    type="submit"
                    class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  >
                    Save Fact
                  </button>
                  <button
                    type="button"
                    class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer`}
                    onClick={handleGenerateFact}
                    disabled={loading()}
                  >
                    <Show when={loading() && !generatedImage() && !audioUrl() && !markdownText()}>
                      Generating...
                    </Show>
                    <Show when={!loading()}>
                      Generate Fact
                    </Show>
                  </button>
                </div>
              </form>
            </div>

            <div class="col-span-1 md:col-span-2 lg:col-span-1">
              <h2 class="text-2xl font-bold mb-4 text-green-600">Fact List</h2>
              <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
                <For each={facts()}>
                  {(fact) => (
                    <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                      <p class="font-semibold text-lg text-green-600 mb-2">{fact.title}</p>
                      <p class="text-gray-700">{fact.description}</p>
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="col-span-1 md:col-span-2 lg:col-span-1">
              <h2 class="text-2xl font-bold mb-4 text-green-600">Additional Features</h2>
              <div class="space-y-4">
                <button
                  onClick={handleGenerateImage}
                  class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer`}
                  disabled={loading()}
                >
                  <Show when={loading() && !generatedImage() && !audioUrl() && !markdownText()}>
                    Generating...
                  </Show>
                  <Show when={!loading()}>
                    Generate Image
                  </Show>
                </button>
                <Show when={newFact().title && newFact().description}>
                  <button
                    onClick={handleTextToSpeech}
                    class={`w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer`}
                    disabled={loading()}
                  >
                    <Show when={loading() && !generatedImage() && !audioUrl() && !markdownText()}>
                      Generating...
                    </Show>
                    <Show when={!loading()}>
                      Text to Speech
                    </Show>
                  </button>
                </Show>
                <button
                  onClick={handleMarkdownGeneration}
                  class={`w-full px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer`}
                  disabled={loading()}
                >
                  <Show when={loading() && !generatedImage() && !audioUrl() && !markdownText()}>
                    Generating...
                  </Show>
                  <Show when={!loading()}>
                    Generate Markdown
                  </Show>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Show when={generatedImage()}>
              <div>
                <h3 class="text-xl font-bold mb-2 text-green-600">Generated Image</h3>
                <img src={generatedImage()} alt="Generated Earth image" class="w-full rounded-lg shadow-md" />
              </div>
            </Show>
            <Show when={audioUrl()}>
              <div>
                <h3 class="text-xl font-bold mb-2 text-green-600">Audio Fact</h3>
                <audio controls src={audioUrl()} class="w-full" />
              </div>
            </Show>
            <Show when={markdownText()}>
              <div>
                <h3 class="text-xl font-bold mb-2 text-green-600">Markdown Story</h3>
                <div class="bg-white p-4 rounded-lg shadow-md">
                  <SolidMarkdown children={markdownText()} />
                </div>
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;
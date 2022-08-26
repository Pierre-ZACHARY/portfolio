import {getAuth, getRedirectResult, GoogleAuthProvider, OAuthCredential, signInWithRedirect} from "@firebase/auth";

export default async function handleGoogleSignIn(): Promise<OAuthCredential | null> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const r = await signInWithRedirect(auth, provider)
    console.log(r);
    const result = await getRedirectResult(auth)
    if(result){
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if(credential){
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            return credential;
        }
        else{
            alert("Google Provider error : No credential given");
        }

    }
    else{
        alert("Unknown user");
    }
    return null;

}
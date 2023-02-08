

export const Office = window.Office

export async function criarPedido(event) {
    try {
        Office.context.ui.displayDialogAsync('https://myDomain/myDialog.html', {height: 30, width: 20, displayInIframe: true});        //Office.context.ui.displayDialogAsync('', {height: 30, width: 20})
    } catch (error) {
        console.log('Erro:', error.message)
        console.error(error)
    }
    finally {
        event.completed()
    }
}
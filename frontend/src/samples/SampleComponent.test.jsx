// src/components/__tests__/SampleComponent.test.jsx
import { render, screen } from "@testing-library/react";
import SampleComponent from "./SampleComponent.jsx";
import * as test from "node:test";


test("findNameReturnsValueFromRepository", async () => {
    // 1️⃣ Arrange → criamos o mock da função (equivalente ao mock do repositório)
    const mockFetchNameById = jest.fn().mockResolvedValue("TeamFoundry");

    // 2️⃣ Act → renderizamos o componente, passando o mock como prop
    render(<SampleComponent fetchNameById={mockFetchNameById} />);

    // 3️⃣ Assert → esperamos o resultado aparecer na tela
    const nameElement = await screen.findByTestId("name");
    expect(nameElement).toHaveTextContent("TeamFoundry");

    // 4️⃣ Verify → garantimos que o mock foi chamado com o parâmetro correto
    expect(mockFetchNameById).toHaveBeenCalledWith(42);
});